import * as uuid from 'uuid';
import InMemoryDebatesRepository from '../../../repositories/in_memory/in_memory_debates_repository';
import DebatesFactory from '../factories/debates_factory';
import { IPinGenerator } from '../services/pin_generator';
import Debate, { IDebateSnapshot } from '../debate';
import DateUtils from '../../support/date_utils';

class StaticPinGenerator implements IPinGenerator {
  constructor(private readonly pin: string) {}

  async getRandomPin(): Promise<string> {
    return this.pin;
  }
}

describe('Debate', () => {
  let debate: Debate;
  let snapshot: IDebateSnapshot;

  const question = 'Question';
  const positiveAnswer = 'Yes';
  const negativeAnswer = 'No';
  const neutralAnswer = 'Maybe';
  const publicationStart = new Date();
  const finishDate = DateUtils.moveDate(publicationStart, { hours: 5 });
  const pin = '10293';

  beforeEach(async () => {
    const debatesRepository = new InMemoryDebatesRepository();
    const debatesFactory = new DebatesFactory(debatesRepository, new StaticPinGenerator(pin));
    debate = await debatesFactory.createReadyForPublication(question, positiveAnswer, negativeAnswer, neutralAnswer);
    debate.schedulePublicationAt(publicationStart);
    debate.scheduleClosingAt(finishDate);
    snapshot = {} as IDebateSnapshot;
    debate.dumpStateToSnapshot(snapshot);
  });

  describe('snapshot', () => {
    it('has id', () => {
      expect(snapshot.id).toBe(debate.id.toString());
    });

    it('has question', () => {
      expect(snapshot.question).toBe(question);
    });

    it('has positive answer', () => {
      expect(snapshot.positiveAnswer).toBe(positiveAnswer);
    });

    it('has negative answer', () => {
      expect(snapshot.negativeAnswer).toBe(negativeAnswer);
    });

    it('has neutral answer', () => {
      expect(snapshot.neutralAnswer).toBe(neutralAnswer);
    });

    it('has publication start date', () => {
      expect(snapshot.publication.startDate.getTime()).toBe(publicationStart.getTime());
    });

    it('has publication finish date', () => {
      expect(snapshot.publication.finishDate.getTime()).toBe(finishDate.getTime());
    });

    it('has pin', () => {
      expect(snapshot.pin).toBe(pin);
    });
  });

  describe('loadFromSnapshot', () => {
    it('is same as debate from which snapshot was made', () => {
      const debateFromSnapshot = Debate.loadFromSnapshot(snapshot);
      const secondSnapshot = {} as IDebateSnapshot;
      debateFromSnapshot.dumpStateToSnapshot(secondSnapshot);
      expect(snapshot).toEqual(secondSnapshot);
    });
  });
});