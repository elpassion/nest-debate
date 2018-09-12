import * as uuid from 'uuid';

class Debate {
  private _positiveAnswer: string;
  private _negativeAnswer: string;
  private _neutralAnswer: string;

  constructor(private id: string, private _question: string, private _ownerId: string) {}

  public updateQuestion(newQuestion: string): void {
    this._question = newQuestion;
  }

  public setPositiveAnswer(answer: string) {
    this._positiveAnswer = answer;
  }

  public setNegativeAnswer(answer: string) {
    this._negativeAnswer = answer;
  }

  public setNeutralAnswer(answer: string) {
    this._neutralAnswer = answer;
  }

  public get question(): string { return this._question; }
  public get ownerId(): string { return this._ownerId; }
  public get positiveAnswer(): string { return this._positiveAnswer; }
  public get negativeAnswer(): string { return this._negativeAnswer; }
  public get neutralAnswer(): string { return this._neutralAnswer; }
}

describe('Debate', () => {
  let debateQuestion: string;
  let ownerId: string;
  let debate: Debate;

  beforeEach(() => {
    debateQuestion = 'Debate question';
    ownerId = uuid.v4();
    debate = new Debate(uuid.v4(), debateQuestion, ownerId);
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