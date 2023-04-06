import moment from 'moment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { ErrorCodes } from 'src/libs/errors';
import { StandardError } from 'src/libs/standard-error';
import { logger } from 'src/libs/logger';
import { UserRepository } from 'src/repositories/user';
import CONSTANTS from 'src/constants';
import { RegisterResponse, LoginResponse, RegisterPayload, LoginPayload } from './types';
import { JWT_TOKEN_SECRET } from 'src/configs/app';

interface UserServiceOptions {
    userRepository: UserRepository;
}

export class UserService {
    private readonly saltRounds = 10;

    constructor(private readonly options: UserServiceOptions) {}

    public async register(registerPayload: RegisterPayload): Promise<RegisterResponse> {
        const { username, password, role } = registerPayload;

        if (await this.options.userRepository.isUserExist(username)) {
            logger.info({ username }, 'This username already exists in the database');
            throw new StandardError(ErrorCodes.DUPLICATE_END_USER, 'username already registered');
        }

        const passwordHash = await bcrypt.hash(password, this.saltRounds);

        const user = await this.options.userRepository.createUser({
            ...registerPayload,
            role,
            password: passwordHash
        });
        const token = await this.createAccessToken(user.id);

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            token
        };
    }

    public async login(loginPayload: LoginPayload): Promise<LoginResponse> {
        const { username, password } = loginPayload;

        const user = await this.options.userRepository.findUser(username);
        if (user && (await bcrypt.compare(password, user.password)) === true) {
            const token = await this.createAccessToken(user.id);

            return {
                id: user.id,
                role: user.role,
                username: user.username,
                token
            };
        }

        throw new StandardError(ErrorCodes.INVALID_USERNAME, 'Invalid username and Password Combination');
    }

    public async delete(userId: string) {
        const existinguser = await this.options.userRepository.getUser(userId);
        if (!existinguser) throw new StandardError(ErrorCodes.USER_NOT_FOUND, 'User does not exist');
        return this.options.userRepository.deleteUser(existinguser);
    }

    private async createAccessToken(endUserId: string): Promise<string> {
        const expiryTime = moment().add(CONSTANTS.moment.THIRTY, 'minutes');
        const userPayload = { endUserId };

        const token = jwt.sign(userPayload, JWT_TOKEN_SECRET, {
            expiresIn: expiryTime.diff(moment(), 'seconds')
        });
        return token;
    }
}
