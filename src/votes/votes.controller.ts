import { Controller, Post, Param, Body } from '@nestjs/common';
import IDebatesRepository from '../domain/debates/debates_repository';
import IVotesRepository from '../domain/debates/votes_repository';
import { DebateId } from '../domain/debates/debate';
import Vote from '../domain/debates/vote';

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
  constructor(private _debatesRepository: IDebatesRepository, private _votesRepository: IVotesRepository) {}

  @Post()
  async create(@Param('debateId') debateId: DebateId, @Body('voteType') voteType): Promise<VoteDto> {
    const voteId = await this._votesRepository.nextId();
    const debate = await this._debatesRepository.get(debateId);

    let vote: Vote;
    if (voteType === 'POSITIVE') { vote = debate.votePositive(voteId); }
    else if (voteType === 'NEGATIVE') { vote = debate.voteNegative(voteId); }
    else if (voteType === 'NEUTRAL') { vote = debate.voteNeutral(voteId); }

    await this._votesRepository.save(vote);
    return VoteDto.fromVote(vote);
  }
}
