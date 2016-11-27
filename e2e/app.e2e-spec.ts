import { Angular2gridsterPage } from './app.po';

describe('angular2gridster App', function() {
  let page: Angular2gridsterPage;

  beforeEach(() => {
    page = new Angular2gridsterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
