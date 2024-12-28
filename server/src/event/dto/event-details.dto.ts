import { IsString } from 'class-validator';

export default class EventDetailsDto {
  @IsString()
  eventId: string;
}