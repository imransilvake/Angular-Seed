// angular
import { AppPage } from './app.po';

describe('workspace-project App', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display footer message', () => {
		AppPage.navigateTo();
		expect(AppPage.getParagraphText()).toEqual('Gemacht Mit favorite');
	});
});
