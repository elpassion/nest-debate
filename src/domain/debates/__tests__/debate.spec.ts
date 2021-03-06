import * as uuid from 'uuid';

import Debate, { DebateId, AnswersMissing, VotingNotPossibleError, PinNotSet } from '../debate';
import Answer, { AnswerType } from '../answer';
import Vote, { VoteId } from '../vote';
import DateProvider from '../../support/date_provider';
import { IPinGenerator } from '../services/pin_generator';

class PinGenerator implements IPinGenerator {
  public async getRandomPin(): Promise<string> {
    const min = 10000;
    const max = 99999;

    return (Math.floor(Math.random() * (max - min + 1) + min)).toString();
  }
}

describe('Debate', () => {
  let debateQuestion: string;
  let ownerId: string;
  let debateId: DebateId;
  let debate: Debate;
  let pinGenerator: IPinGenerator;

  beforeEach(() => {
    debateId = new DebateId(uuid.v4());
    debateQuestion = 'Debate question';
    ownerId = uuid.v4();
    debate = new Debate(debateId, debateQuestion);
    pinGenerator = new PinGenerator();
  });

  it('has question', () => {
    expect(debate.question).toEqual(debateQuestion);
  });

  it('can update question', () => {
    const newQuestion = 'Updated debate question';

    debate.updateQuestion(newQuestion);

    expect(debate.question).toEqual(newQuestion);
  });

  it('has positive answer', () => {
    const answer = 'Positive Answer';

    debate.setPositiveAnswer(answer);
    expect(debate.positiveAnswer).toEqual(Answer.createPositive(debate.id, answer));
  });

  it('has negative answer', () => {
    const answer = 'Negative Answer';

    debate.setNegativeAnswer(answer);
    expect(debate.negativeAnswer).toEqual(Answer.createNegative(debate.id, answer));
  });

  it('has neutral answer', () => {
    const answer = 'Neutral Answer';

    debate.setNeutralAnswer(answer);
    expect(debate.neutralAnswer).toEqual(Answer.createNeutral(debate.id, answer));
  });

  describe('Publishing', () => {
    it('is not published', () => {
      expect(debate.isPublished).toBe(false);
    });

    describe('when all answers set', () => {
      beforeEach(() => {
        debate.setPositiveAnswer('Yes');
        debate.setNegativeAnswer('No');
        debate.setNeutralAnswer('Maybe');
      });

      describe('when pin not set', () => {
        it('cannot be published', () => {
          expect(() => { debate.publish(); }).toThrowError(PinNotSet);
        });

        it('cannot be scheduled for publication', () => {
          expect(() => { debate.schedulePublicationAt(new Date()); }).toThrowError(PinNotSet);
        });
      });

      describe('when PIN set', () => {
        beforeEach(async () => {
          await debate.pickPin(pinGenerator);
        });

        it('can be published when all answers are set', () => {
          debate.publish();

          expect(debate.isPublished).toBe(true);
        });

        it('can be scheduled for publication', () => {
          const publishAt = new Date(new Date().getTime() + 1000 * 60 * 5);
          debate.schedulePublicationAt(publishAt);

          expect(debate.isPublished).toBe(false);

          travelInTimeTo(publishAt, () => {
            expect(debate.isPublished).toBe(true);
          });
        });

        it('can be scheduled for closing', () => {
          const closeAt = new Date(new Date().getTime() + 1000 * 60 * 5);
          debate.publish();
          debate.scheduleClosingAt(closeAt);

          travelInTimeTo(closeAt, () => {
            expect(debate.isPublished).toBe(false);
          });
        });

        it('can be closed', () => {
          debate.publish();
          debate.close();

          expect(debate.isPublished).toBe(false);
        });
      });
    });

    describe('When not all answers are set', () => {
      describe.each(
        [
          [null, null, null],
          ['Yes', null, null],
          [null, 'No', null],
          [null, null, 'Maybe'],
          ['Yes', 'No', null],
          ['Yes', null, 'Maybe'],
          [null, 'No', 'Maybe'],
        ])(
        'when positive answer: %s, negative answer: %s, neutral answer: %s',
        (positiveAnswer, negativeAnswer, neutralAnswer) => {
          beforeEach(() => {
            if (positiveAnswer) { debate.setPositiveAnswer(positiveAnswer); }
            if (negativeAnswer) { debate.setNegativeAnswer(negativeAnswer); }
            if (neutralAnswer) { debate.setNeutralAnswer(neutralAnswer); }
          });

          it('cannot be published', () => {
            expect(() => { debate.publish(); }).toThrowError(AnswersMissing);
          });

          it('cannot be scheduled for publication', () => {
            expect(() => { debate.schedulePublicationAt(new Date()); }).toThrowError(AnswersMissing);
          });
        },
      );
    });
  });

  describe('DebateId', () => {
    it('equals other debate id with same id', () => {
      const stringId = uuid.v4();
      const firstId = new DebateId(stringId);
      const secondId = new DebateId(stringId);

      expect(firstId.equals(secondId)).toBe(true);
    });

    it('does not equal different debate id', () => {
      const firstId = new DebateId(uuid.v4());
      const secondId = new DebateId(uuid.v4());

      expect(firstId.equals(secondId)).toBe(false);
    });
  });

  function travelInTimeTo(date: Date, action: () => void): void {
    const originalDategenerationStrategy = DateProvider.dateGenerationStrategy;
    DateProvider.dateGenerationStrategy = () => date;
    action();
    DateProvider.dateGenerationStrategy = originalDategenerationStrategy;
  }
});