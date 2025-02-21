import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, User } from '@app/shared';

@Resolver()
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async getUser(): Promise<User[]> {
    const users = await this.usersService.findAllUser();
    return users;
  }
}
