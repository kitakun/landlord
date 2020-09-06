/**
 * Interface for basic web controller
 */
export default interface IInjectableController {
    Inject(server: Express.Application): void;
}