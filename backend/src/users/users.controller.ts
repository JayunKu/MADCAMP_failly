import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUserMe() {
    // This should be implemented with AuthGuard and user decorator
    return this.usersService.getUserMe();
  }

  @Get(':id/badges')
  getUserBadges(@Param('id') userId: string) {
    return this.usersService.getUserBadges(userId);
  }

  @Get(':user_id/failposts')
  getUserFailposts(@Param('user_id') userId: string) {
    return this.usersService.getUserFailposts(userId);
  }

  @Post(':user_id/badges')
  obtainBadge(
    @Param('user_id') userId: string,
    @Body() obtainBadgeDto: any, // DTO is not defined yet, so using 'any' for now.
  ) {
    return this.usersService.obtainBadge(userId, obtainBadgeDto);
  }
}
