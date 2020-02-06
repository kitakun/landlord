export default interface IInjectableController {
    Inject(server: Express.Application): void;
}