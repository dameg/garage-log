import type { Vehicle } from '../types';

type ListCardProps = { vehicle: Pick<Vehicle, 'id' | 'title' | 'body'> };

export function ListCard({ vehicle }: ListCardProps) {
  const { title, body } = vehicle;
  return (
    <div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
