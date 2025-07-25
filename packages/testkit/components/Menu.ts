import { test, Page, Locator } from "@playwright/test";
import { MenuItem } from "./MenuItem";
import { BaseElement } from "./BaseElement";

/**
 * Class representing a List element.
 * Extends the BaseElement class.
 */
export class Menu extends BaseElement {
  private items: MenuItem[];
  private itemsInitialized: boolean;

  /**
   * Create a Menu.
   * @param {Page} page - The Playwright page object.
   * @param {Locator} locator - The locator for the List element.
   * @param {string} elementReportName - The name for reporting purposes.
   */
  constructor(page: Page, locator: Locator, elementReportName: string) {
    super(page, locator, elementReportName);
    this.items = [];
    this.itemsInitialized = false;
  }

  /**
   * Get all menu items.
   * @returns {Promise<MenuItem[]>} An array of MenuItem objects.
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    let menuItems: MenuItem[] = [];
    await test.step(`Get all menu items in ${this.elementReportName}`, async () => {
      const menuItemsLocators = await this.locator.getByRole("menuitem").all();
      const menuItemsPromises = menuItemsLocators.map(
        async locator => new MenuItem(this.page, locator, await locator.innerText())
      );
      menuItems = await Promise.all(menuItemsPromises);
    });
    return menuItems;
  }

  /**
   * Get a menu item by its name.
   * @param {string} itemName - The name of the item to retrieve.
   * @returns {ListItem | undefined} The list item with the specified name or undefined if not found.
   */
  async getItemByName(itemName: string): Promise<MenuItem | undefined> {
    let menuItem: MenuItem | undefined;
    await test.step(`Get menu item by name ${itemName} in ${this.elementReportName}`, async () => {
      const menuItemLocator = this.locator.getByRole("menuitem");
      menuItem = new MenuItem(
        this.page,
        menuItemLocator.filter({ has: this.page.getByText(itemName, { exact: true }) }),
        `Menu Item: ${itemName}`
      );
    });
    return menuItem;
  }

  /**
   * Select a menu item.
   * @param {string} listItem - The name of the item to select.
   * @returns {Promise<void>}
   */
  async selectItem(listItem: string): Promise<void> {
    await test.step(`Select menu item ${listItem} in ${this.elementReportName}`, async () => {
      const menuItem = await this.getItemByName(listItem);
      await menuItem?.click();
    });
  }

  async selectSubItem(rootItem: string, subItem: string): Promise<void> {
    await test.step(`Select sub menu item ${subItem} in ${rootItem} in ${this.elementReportName}`, async () => {
      const rootMenuItem = await this.getItemByName(rootItem);
      await rootMenuItem?.hover();
      const secondaryMenu = new Menu(this.page, this.page.locator(`.secondary-menu-enter-done`), `Secondary Menu`);
      await secondaryMenu.selectItem(subItem);
    });
  }
}
