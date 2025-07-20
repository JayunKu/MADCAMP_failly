import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  obtainBadge(userId: string, obtainBadgeDto: any) {
    // Implementation needed
    return `This action gives a badge to user #${userId}`;
  }
}