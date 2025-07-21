import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile, Query, ForbiddenException } from '@nestjs/common';
import { FailpostsService } from './failposts.service';
import { CreateFailpostDto } from './dto/create-failpost/create-failpost';
import { AddReactionDto } from './dto/add-reaction/add-reaction';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('failposts')
export class FailpostsController {
  constructor(private readonly failpostsService: FailpostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createFailpost(
    @Body() createFailpostDto: CreateFailpostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.failpostsService.createFailpost(createFailpostDto, image);
  }

  @Get()
  getFailposts(@Query('tag') tag?: string) {
    return this.failpostsService.getFailposts(tag);
  }

  @Get(':failpost_id')
  getFailpostDetail(@Param('failpost_id') failpostId: string) {
    return this.failpostsService.getFailpostDetail(failpostId);
  }

  @Delete(':failpost_id')
  deleteFailpost(
    @Param('failpost_id') failpostId: string,
    @Query('user_id') userId: string,
  ) {
    return this.failpostsService.deleteFailpost(failpostId, userId);
  }

  @Post(':failpost_id/reactions')
  addFailpostReaction(
    @Param('failpost_id') failpostId: string,
    @Body() addReactionDto: AddReactionDto,
  ) {
    return this.failpostsService.addFailpostReaction(failpostId, addReactionDto);
  }
}
