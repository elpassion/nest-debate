import { Entity, PrimaryColumn, Column } from 'typeorm';
import { IDebateSnapshot } from 'domain/debates/debate';
import { IPublicationSnapshot } from 'domain/debates/publication';

class PublicationSnapshot implements IPublicationSnapshot {
  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  finishDate: Date;
}

@Entity({ name: 'debates' })
export default class DebateSnapshot implements IDebateSnapshot {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  question: string;

  @Column({ nullable: true })
  positiveAnswer: string;

  @Column({ nullable: true })
  negativeAnswer: string;

  @Column({ nullable: true })
  neutralAnswer: string;

  @Column(type => PublicationSnapshot)
  publication: PublicationSnapshot;

  @Column({ nullable: true, unique: true })
  pin: string;
}