import * as uuid from 'uuid';
import { DebateId } from './debate';
import Answer, { AnswerType } from './answer';

describe('Answer', () => {
  let debateId: DebateId;
  let answerType: AnswerType;
  let answer: string;

  beforeEach(() => {
    debateId = new DebateId(uuid.v4());
    answerType = AnswerType.POSITIVE;
    answer = 'Debate question answer';
  });

  it('is equal with same answer for same debate', () => {
    const firstAnswer = new Answer(debateId, answerType, answer);
    const secondAnswer = new Answer(debateId, answerType, answer);

    expect(firstAnswer.equals(secondAnswer)).toBe(true);
  });

  it('is not equal when debate id is different', () => {
    const firstAnswer = new Answer(new DebateId(uuid.v4()), answerType, answer);
    const secondAnswer = new Answer(new DebateId(uuid.v4()), answerType, answer);

    expect(firstAnswer.equals(secondAnswer)).toBe(false);
  });

  it('is not equal when answer types are different', () => {
    const firstAnswer = new Answer(debateId, AnswerType.POSITIVE, answer);
    const secondAnswer = new Answer(debateId, AnswerType.NEGATIVE, answer);

    expect(firstAnswer.equals(secondAnswer)).toBe(false);
  });

  it('is not equal when answers are different', () => {
    const firstAnswer = new Answer(debateId, answerType, 'first answer');
    const secondAnswer = new Answer(debateId, answerType, 'second answer');

    expect(firstAnswer.equals(secondAnswer)).toBe(false);
  });
});