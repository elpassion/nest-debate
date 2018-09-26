import IDebatesRepository from '../domain/debates/debates_repository';
import Debate, { DebateId } from '../domain/debates/debate';
import InMemoryDebatesRepository from './in_memory_debates_repository';
import { PinAlreadyReserved } from '../domain/debates/services/pin_generator';

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

  it('throws error if pin already reserverd', async () => {
    await debatesRepository.reservePin('12345');
    await expect(debatesRepository.reservePin('12345')).rejects.toThrowError(PinAlreadyReserved);
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