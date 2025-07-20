import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ObtainBadgeDto } from './dto/obtain-badge/obtain-badge';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserInfo(userId: string) {
    const userWithBadges = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
      },
    });

    if (!userWithBadges) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const { password, badges, current_tag, ...restOfUser } = userWithBadges;

    const current_badges = badges.map((userBadge) => ({
      badge_tag: userBadge.badge.tag,
      badge_name: userBadge.badge.badge_name,
      badge_image_url: userBadge.badge.image_url,
    }));

    return {
      message: 'success',
      user: {
        ...restOfUser,
        current_badges,
      },
    };
  }

  getUserBadges(userId: string) {

    return `This action returns all badges for user #${userId}`;
  }

  async getUserFailposts(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const posts = await this.prisma.failPost.findMany({
      where: {
        user_id: userId,
      },
      include: {
        badge: true, // badge 관계 포함
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    
    const failposts = posts.map((post) => ({
      id: post.id,
      text: post.text,
      tag: post.tag,
      image_id: post.image_id,
      created_at: post.created_at.toISOString(),
      badge: {
        tag: post.badge.tag,
        badge_name: post.badge.badge_name,
      },
    }));

    return {
      message: 'success',
      failposts,
    };
  }

  async obtainBadge(userId: string, obtainBadgeDto: ObtainBadgeDto) {
    const { tag } = obtainBadgeDto;

    // 1. 유저 존재 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('user not found'); // 404
    }

    const existing = await this.prisma.userBadge.findUnique({
      where: {
        user_id_tag: { user_id: userId, tag },
      },
    });

    if (existing) {
      throw new BadRequestException('user already has this badge'); // 400
    }

    const badge = await this.prisma.badge.findUnique({
      where: { tag },
    });

    if (!badge) {
      throw new BadRequestException('invalid badge tag'); // 400
    }

    const created = await this.prisma.userBadge.create({
      data: {
        user_id: userId,
        tag,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        current_tag: tag,
      },
    });


    const obtained_badge = {
      message: 'success',
      badge: {
        tag: badge.tag,
        badge_name: badge.badge_name,
      },
      obtained_at: created.obtained_at.toISOString(),
    };

    return obtained_badge;

  }
}