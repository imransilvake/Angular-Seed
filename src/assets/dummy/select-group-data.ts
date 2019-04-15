// app
import { SelectGroupInterface } from '../../app/packages/core.pck/fields.mod/interfaces/select-group.interface';

const selectGroupData: SelectGroupInterface[] = [
	{
		name: 'Grass',
		items: [
			{value: 'bulbasaur-0', viewValue: 'Bulbasaur'},
			{value: 'oddish-1', viewValue: 'Oddish'},
			{value: 'bellsprout-2', viewValue: 'Bellsprout'}
		]
	},
	{
		name: 'Water',
		items: [
			{value: 'squirtle-3', viewValue: 'Squirtle'},
			{value: 'psyduck-4', viewValue: 'Psyduck'},
			{value: 'horsea-5', viewValue: 'Horsea'}
		]
	},
	{
		name: 'Fire',
		disabled: true,
		items: [
			{value: 'charmander-6', viewValue: 'Charmander'},
			{value: 'vulpix-7', viewValue: 'Vulpix'},
			{value: 'flareon-8', viewValue: 'Flareon'}
		]
	},
	{
		name: 'Psychic',
		items: [
			{value: 'mew-9', viewValue: 'Mew'},
			{value: 'mewtwo-10', viewValue: 'Mewtwo'},
		]
	}
];

export default selectGroupData;
