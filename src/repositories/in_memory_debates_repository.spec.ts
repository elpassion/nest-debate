import * as uuid from 'uuid';

import IDebatesRepository from '../domain/debates/debates_repository';
import Debate, { DebateId } from '../domain/debates/debate';

class InMemoryDebatesRepository implements IDebatesRepository {
  private _debates = new Map<DebateId, Debate>();

  public nextId(): Promise<DebateId> {
    const debateId = new DebateId(uuid.v4());
    return Promise.resolve(debateId);
  }

  public get(debateId: DebateId): Promise<Debate> {
    const debate = this._debates.get(debateId);
    return Promise.resolve(debate || null);
  }

  public save(debate: Debate): Promise<void> {
    this._debates.set(debate.id, debate);
    return Promise.resolve();
  }

  public all(): Promise<Debate[]> {
    const debates = this._debates.values();
    return Promise.resolve(Array.from(debates));
  }

  public delete(debate: Debate): Promise<void> {
    this._debates.delete(debate.id);
    return Promise.resolve();
  }
}

describe('DebatesRepository', () => {
  let debatesRepository: IDebatesRepository;

  beforeEach(() => {
    debatesRepository = new InMemoryDebatesRepository();
  });

  it('returns next id', async () => {
    const [debateId, secondDebateId] = await Promise.all([debatesRepository.nextId(), debatesRepository.nextId()]);

    expect(debateId.equals(secondDebateId)).toBe(false);
  });

  it('saves debate', async () => {
    const debateId = await debatesRepository.nextId();
    const debate = createDebate(
      debateId,
      'debate question',
      'positive answer',
      'negative answer',
      'neutral answer',
    );

    await debatesRepository.save(debate);
    const persistedDebate = await debatesRepository.get(debate.id);

    expect(debate.id.equals(persistedDebate.id)).toBe(true);
  });

  it('fetches all debates', async () => {
    const [firstDebateId, secondDebateId] = await Promise.all([debatesRepository.nextId(), debatesRepository.nextId()]);

    const firstDebate = createDebate(firstDebateId, 'first question');
    const secondDebate = createDebate(secondDebateId, 'second question');

    await Promise.all([debatesRepository.save(firstDebate), debatesRepository.save(secondDebate)]);
    const debates = await debatesRepository.all();

    expect(debates.length).toBe(2);
    expect(debates.find(findById(firstDebateId))).not.toBeUndefined();
    expect(debates.find(findById(secondDebateId))).not.toBeUndefined();
  });

  it('deletes debate', async () => {
    const [firstDebateId, secondDebateId] = await Promise.all([debatesRepository.nextId(), debatesRepository.nextId()]);

    const firstDebate = createDebate(firstDebateId, 'first question');
    const secondDebate = createDebate(secondDebateId, 'second question');

    await Promise.all([debatesRepository.save(firstDebate), debatesRepository.save(secondDebate)]);
    await debatesRepository.delete(firstDebate);
    const debate = await debatesRepository.get(firstDebateId);

    expect(debate).toBeNull();
  });

  function createDebate(debateId: DebateId, question: string, positiveAnswer?: string, negativeAnswer?: string, neutralAnswer?: string): Debate {
    const debate = new Debate(debateId, question);
    if (positiveAnswer) { debate.setPositiveAnswer(positiveAnswer); }
    if (negativeAnswer) { debate.setNegativeAnswer(negativeAnswer); }
    if (neutralAnswer) { debate.setNeutralAnswer(neutralAnswer); }

    return debate;
  }

  function findById(debateId: DebateId): (debate: Debate) => boolean {
    return (debate: Debate) => debate.id.equals(debateId);
  }
});