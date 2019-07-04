// app
import { AutocompleteGroupInterface } from '../../app/packages/core.pck/fields.mod/interfaces/autocomplete-group.interface';

const autocompleteGroupData: AutocompleteGroupInterface[] = [
	{
		name: 'Grass',
		items: [
			{ id: 'bulbasaur-0', text: 'Bulbasaur' },
			{ id: 'oddish-1', text: 'Oddish' },
			{ id: 'bellsprout-2', text: 'Bellsprout' }
		]
	},
	{
		name: 'Water',
		items: [
			{ id: 'squirtle-3', text: 'Squirtle' },
			{ id: 'psyduck-4', text: 'Psyduck' },
			{ id: 'horsea-5', text: 'Horsea' }
		]
	},
	{
		name: 'Fire',
		disabled: true,
		items: [
			{ id: 'charmander-6', text: 'Charmander' },
			{ id: 'vulpix-7', text: 'Vulpix' },
			{ id: 'flareon-8', text: 'Flareon' }
		]
	},
	{
		name: 'Psychic',
		items: [
			{ id: 'mew-9', text: 'Mew' },
			{ id: 'mewtwo-10', text: 'Mewtwo' },
		]
	}
];

export default autocompleteGroupData;
