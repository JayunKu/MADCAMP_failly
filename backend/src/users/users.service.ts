import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUserInfo(userId: string) {
    // Implementation needed
    return `This action returns a #${userId} user`;
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
