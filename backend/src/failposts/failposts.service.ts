import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFailpostDto } from './dto/create-failpost/create-failpost';
import { uploadToGCS } from '../gcs.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class FailpostsService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway, // ChatGateway 주입
  ) {}

  async createFailpost(
    createFailpostDto: CreateFailpostDto,
    image: Express.Multer.File,
  ) {
    const { user_id, text, tag } = createFailpostDto;

    // 1. 유저 존재 확인
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    console.log('create_fail_post의 유저 id : ', user_id);
    console.log('create_fail_post의 tag : ', tag);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // 2. 태그 존재 확인
    const badge = await this.prisma.badge.findUnique({
      where: { tag },
    });
    if (!badge) {
      throw new BadRequestException('invalid tag');
    }

    // 3. 이미지 GCS 업로드 (선택 사항)
    let imageUrl = '';
    if (image) {
      try {
        imageUrl = await uploadToGCS(image.buffer, 'failposts', image.mimetype);
      } catch (error) {
        console.error('GCS upload error:', error);
        throw new InternalServerErrorException('image upload failed');
      }
    }

    // 4. FailPost 생성
    const failpost = await this.prisma.failPost.create({
      data: {
        user_id,
        text,
        tag,
        image_id: imageUrl,
      },
    });

    // 5. User의 current_tag 업데이트
    await this.prisma.user.update({
      where: { id: user_id },
      data: { current_tag: tag },
    });

    // 6. ChatGateway를 통해 매칭 로직 실행
    this.chatGateway.tryMatchUser(user_id, tag);

    return {
      message: 'success',
      failpost_id: failpost.id,
    };
  }

  async getFailposts(tag?: string) {
    if (tag) {
      const badge = await this.prisma.badge.findUnique({
        where: { tag },
      });
      if (!badge) {
        throw new BadRequestException('invalid tag');
      }
    }

    console.log('쿼리로 받은 tag:', tag);

    const whereCondition = tag ? { tag } : {};

    const posts = await this.prisma.failPost.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const failposts = posts.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      nickname: post.user.nickname,
      text: post.text,
      tag: post.tag,
      image_url: post.image_id,
      created_at: post.created_at.toISOString(),
    }));

    return {
      message: 'success',
      failposts,
    };
  }

  async getFailpostDetail(id: string) {
    const failpost = await this.prisma.failPost.findUnique({
      where: { id },
      include: {
        reactions: true,
      },
    });

    if (!failpost) {
      throw new NotFoundException('failpost not found');
    }

    return {
      message: 'success',
      failpost: {
        id: failpost.id,
        text: failpost.text,
        tag: failpost.tag,
        image_url: failpost.image_id,
        created_at: failpost.created_at.toISOString(),
        reactions: failpost.reactions.map((r) => ({
          type: r.reaction_type,
          count: r.count,
        })),
      },
    };
  }

  async deleteFailpost(id: string, userId: string) {
    const failpost = await this.prisma.failPost.findUnique({
      where: { id },
    });

    if (!failpost) {
      throw new NotFoundException('failpost not found');
    }

    if (failpost.user_id !== userId) {
      throw new ForbiddenException('you are not the owner of this failpost');
    }

    // 연결된 reaction 레코드 먼저 삭제
    await this.prisma.failpostReactionCount.deleteMany({
      where: { failpost_id: id },
    });

    // 그 다음 failpost 삭제
    await this.prisma.failPost.delete({
      where: { id },
    });

    return { message: 'success' };
  }

  async addFailpostReaction(id: string, addReactionDto: any) {
  const { reaction_type, delta } = addReactionDto;

  const failpost = await this.prisma.failPost.findUnique({
    where: { id },
  });

  if (!failpost) {
    throw new NotFoundException('failpost not found');
  }

  const reaction = await this.prisma.reaction.findUnique({
    where: { reaction_type },
  });

  if (!reaction) {
    throw new BadRequestException('invalid reaction type');
  }

  // 기존 반응 count 불러오기 (없으면 0으로 간주)
  const existing = await this.prisma.failpostReactionCount.findUnique({
    where: {
      failpost_id_reaction_type: {
        failpost_id: id,
        reaction_type,
      },
    },
  });

  const currentCount = existing?.count ?? 0;
  const newCount = Math.max(0, currentCount + delta);

  if (existing) {
    await this.prisma.failpostReactionCount.update({
      where: {
        failpost_id_reaction_type: {
          failpost_id: id,
          reaction_type,
        },
      },
      data: {
        count: newCount,
      },
    });
  } else {
    await this.prisma.failpostReactionCount.create({
      data: {
        failpost_id: id,
        reaction_type,
        count: newCount,
      },
    });
  }

  console.log('reaction count changed');

  return { message: 'success' };
}

}
