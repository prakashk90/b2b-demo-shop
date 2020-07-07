import Component from 'ShopUi/models/component';

export default class QuantityCounter extends Component {
    protected incrementButton: HTMLButtonElement;
    protected decrementButton: HTMLButtonElement;
    protected input: HTMLInputElement;
    protected value: number;
    protected duration: number = 1000;
    protected timeout: number = 0;
    protected eventChange: Event = new Event('change');
    protected eventInput: Event = new Event('input');
    protected numberOfDecimalPlaces: number = 10;

    protected readyCallback(): void {}

    protected init(): void {
        this.incrementButton = <HTMLButtonElement>this.getElementsByClassName(`${this.jsName}__button-increment`)[0];
        this.decrementButton = <HTMLButtonElement>this.getElementsByClassName(`${this.jsName}__button-decrement`)[0];
        this.input = <HTMLInputElement>this.getElementsByClassName(`${this.jsName}__input`)[0];
        this.value = this.getValue;
        this.mapEvents();
    }

    protected mapEvents(): void {
        this.decrementButton.addEventListener('click', (event: Event) => this.decrementValue(event));
        this.incrementButton.addEventListener('click', (event: Event) => this.incrementValue(event));

        if (this.autoUpdate) {
            this.input.addEventListener('change', () => this.delayToSubmit());
        }
    }

    protected incrementValue(event: Event): void {
        event.preventDefault();
        if (this.isAvailable) {
            const value = Number(this.input.value);
            const potentialValue = Number((((value * this.precision) + (this.step * this.precision)) /
                this.precision).toFixed(this.numberOfDecimalPlaces));

            if (value < this.maxQuantity) {
                this.input.value = potentialValue.toString();
                this.triggerInputEvent();
            }
        }
    }

    protected decrementValue(event: Event): void {
        event.preventDefault();
        if (this.isAvailable) {
            const value = Number(this.input.value);
            const potentialValue = Number((((value * this.precision) - (this.step * this.precision)) /
                this.precision).toFixed(this.numberOfDecimalPlaces));

            if (potentialValue >= this.minQuantity) {
                this.input.value = potentialValue.toString();
                this.triggerInputEvent();
            }
        }
    }

    protected triggerInputEvent(): void {
        this.input.dispatchEvent(this.eventChange);
        this.input.dispatchEvent(this.eventInput);
    }

    protected delayToSubmit(): void {
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => this.onSubmit(), this.duration);
    }

    protected onSubmit(): void {
        if (this.value !== this.getValue) {
            this.input.form.submit();
        }
    }

    protected get minQuantity(): number {
        return Number(this.input.getAttribute('min'));
    }

    protected get maxQuantity(): number {
        const max = Number(this.input.getAttribute('max'));

        return max > 0 && max > this.minQuantity ? max : Infinity;
    }

    protected get step(): number {
        const step = Number(this.input.getAttribute('step'));

        return step > 0 ? step : 1;
    }

    protected get getValue(): number {
        return Number(this.input.value);
    }

    protected get autoUpdate(): boolean {
        return !!this.input.dataset.autoUpdate;
    }

    protected get isAvailable(): boolean {
        return !this.input.disabled && !this.input.readOnly;
    }

    protected get precision(): number {
        return Number(`1${'0'.repeat(this.numberOfDecimalPlaces)}`);
    }
}