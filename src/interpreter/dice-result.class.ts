import { ExpressionNode } from '../ast';
import { ErrorMessage } from '../parser/error-message.class';
import { Result } from './result.class';

export class DiceResult extends Result {
    readonly successes: number;
    readonly failures: number;
    readonly errors: ErrorMessage[];

    constructor(
        expression: ExpressionNode,
        renderedExpression: string,
        total: number,
        successes: number,
        failures: number,
        errors: ErrorMessage[]
    ) {
        super(expression, renderedExpression, total);
        this.successes = successes;
        this.failures = failures;
        this.errors = errors;
    }
}
