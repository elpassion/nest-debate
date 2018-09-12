import * as uuid from 'uuid';

import Debate, { DebateId } from './debate';

describe('Debate', () => {
  let debateQuestion: string;
  let ownerId: string;
  let debateId: DebateId;
  let debate: Debate;

  beforeEach(() => {
    debateId = new DebateId(uuid.v4());
    debateQuestion = 'Debate question';
    ownerId = uuid.v4();
    debate = new Debate(debateId, debateQuestion, ownerId);
  });

  it('has question', () => {
    expect(debate.question).toEqual(debateQuestion);
  });

  it('has owner', () => {
    expect(debate.ownerId).toEqual(ownerId);
  });

  it('can update question', () => {
    const newQuestion = 'Updated debate question';

    debate.updateQuestion(newQuestion);

    expect(debate.question).toEqual(newQuestion);
  });

  it('has positive answer', () => {
    const answer = 'Positive Answer';

    debate.setPositiveAnswer(answer);
    expect(debate.positiveAnswer).toEqual(answer);
  });

  it('has negative answer', () => {
    const answer = 'Negative Answer';

    debate.setNegativeAnswer(answer);
    expect(debate.negativeAnswer).toEqual(answer);
  });

  it('has neutral answer', () => {
    const answer = 'Neutral Answer';

    debate.setNeutralAnswer(answer);
    expect(debate.neutralAnswer).toEqual(answer);
  });
});