import { Controller, Post, Param, Body, Put } from '@nestjs/common';
import { DebateId } from '../domain/debates/debate';
import Vote, { VoteId } from '../domain/debates/vote';
import { IVotingService, VoteType } from '../services/voting.service';

class VoteDto {
  public static fromVote(vote: Vote): VoteDto {
    let voteType: string;
    if (vote.isPositive) { voteType = 'POSITIVE'; }
    if (vote.isNegative) { voteType = 'NEGATIVE'; }
    if (vote.isNeutral) { voteType = 'NEUTRAL'; }

    return new VoteDto(
      vote.id.toString(),
      voteType,
      vote.debateId.toString(),
    );
  }

  constructor(
    readonly id: string,
    readonly voteType: string,
    readonly debateId: string,
  ) {}
}

@Controller('/debates/:debateId/votes')
export class VotesController {
  constructor(private _votingService: IVotingService) {}

  @Post()
  async create(@Param('debateId') debateId: DebateId, @Body('voteType') voteType: string): Promise<VoteDto> {
    const vote = await this._votingService.createVote(debateId, VoteType[voteType]);
    return VoteDto.fromVote(vote);
  }

  @Put('/:voteId')
  async update(@Param('debateId') debateId: DebateId, @Param('voteId') voteId: VoteId, @Body('voteType') voteType: string): Promise<VoteDto> {
    const vote = await this._votingService.changeVote(debateId, voteId, VoteType[voteType]);
    return VoteDto.fromVote(vote);
  }
}
