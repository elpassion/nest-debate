import IDebatesRepository from '../debates_repository';
import { IPinGenerator } from '../services/pin_generator';
import Debate from '../debate';

export default class DebatesFactory {
  constructor(private readonly _debatesRepository: IDebatesRepository, private readonly _pinGenerator: IPinGenerator) {}

  public async createPublished(question: string, positiveAnswer: string, negativeAnswer: string, neutralAnswer: string): Promise<Debate> {
    const debate = await this.create(question, positiveAnswer, negativeAnswer, neutralAnswer);
    await debate.pickPin(this._pinGenerator);
    debate.publish();

    return debate;
  }

  public async create(question: string, positiveAnswer: string, negativeAnswer: string, neutralAnswer: string): Promise<Debate> {
    const debateId = await this._debatesRepository.nextId();
    const debate = new Debate(debateId, question);
    debate.setPositiveAnswer(positiveAnswer);
    debate.setNegativeAnswer(negativeAnswer);
    debate.setNeutralAnswer(neutralAnswer);

    return debate;
  }
}