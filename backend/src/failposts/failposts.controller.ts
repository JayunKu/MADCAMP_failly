import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FailpostsService } from './failposts.service';
import { CreateFailpostDto } from './dto/create-failpost/create-failpost';
import { AddReactionDto } from './dto/add-reaction/add-reaction';

@Controller('failposts')
export class FailpostsController {
  constructor(private readonly failpostsService: FailpostsService) {}

  @Post()
  createFailpost(@Body() createFailpostDto: CreateFailpostDto) {
    return this.failpostsService.createFailpost(createFailpostDto);
  }

  @Get()
  getFailposts() {
    return this.failpostsService.getFailposts();
  }

  @Get(':failpost_id')
  getFailpostDetail(@Param('failpost_id') failpostId: string) {
    return this.failpostsService.getFailpostDetail(failpostId);
  }

  @Delete(':failpost_id')
  deleteFailpost(@Param('failpost_id') failpostId: string) {
    return this.failpostsService.deleteFailpost(failpostId);
  }

  @Post(':failpost_id/reactions')
  addFailpostReaction(
    @Param('failpost_id') failpostId: string,
    @Body() addReactionDto: AddReactionDto,
  ) {
    return this.failpostsService.addFailpostReaction(failpostId, addReactionDto);
  }
}
