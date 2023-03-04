import 'ghostsui';
import './main.scss';
import Boot from './ui/Boot.svelte';

const root = document.querySelector<HTMLDivElement>('#root')!;

// Mount the app
new Boot({
    target: root,
});
