import { Angular2gridster2Page } from './app.po';

describe('angular2gridster2 App', function() {
  let page: Angular2gridster2Page;

  beforeEach(() => {
    page = new Angular2gridster2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
