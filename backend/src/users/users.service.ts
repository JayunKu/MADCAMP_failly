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
    // Implementation needed
    return `This action returns all badges for user #${userId}`;
  }

  getUserFailposts(userId: string) {
    // Implementation needed
    return `This action returns all failposts for user #${userId}`;
  }

  obtainBadge(userId: string, obtainBadgeDto: any) {
    // Implementation needed
    return `This action gives a badge to user #${userId}`;
  }
}