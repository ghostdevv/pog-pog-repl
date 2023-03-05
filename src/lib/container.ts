import { WebContainer } from '@webcontainer/api';
import { getContext } from 'svelte';

export function get_container() {
    return getContext<WebContainer>('container');
}
