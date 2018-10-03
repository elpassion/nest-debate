import IDebatesRepository from '../debates_repository';
import Debate, { DebateId } from '../debate';

type RepositorySetup = () => Promise<IDebatesRepository>;

const itConformsToDebateRepositorySpecification = ( repositorySetup: RepositorySetup ) => {
  describe('Conforms to DebatesRepository Specification', () => {
    let debatesRepository: IDebatesRepository;

    beforeEach(async () => {
      debatesRepository = await repositorySetup();
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
};

export default itConformsToDebateRepositorySpecification;