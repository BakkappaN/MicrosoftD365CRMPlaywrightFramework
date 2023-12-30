import { expect} from "@playwright/test";
import {  CommandBarGlobalButtonsSelectors, FormSelectors} from "../selectors/commonselectors.json";

/* String format.
* @param str String, needs to be formatted.
* @param args Arguments, needs to be placed properly in the string.
*/
export const stringFormat = (str, ...args) =>
   str.replace(/{(\d+)}/g, (match, index) => args[index].toString() || "");

export async function waitUntilAppIdle(page) {
   // eslint-disable-next-line no-restricted-syntax
   try {
      await page.waitForFunction(() => (window).UCWorkBlockTracker?.isAppIdle());
   } catch (e) {
      console.log("waitUntilIdle failed, ignoring.., error: " + e?.message);
   }
}

export async function navigateToApps(page, appId, appName){
   console.log('Navigate to ' + appName.toString() + ' - Start');
   await page.goto('/main.aspx?appid=' + appId.toString() );
   await expect(page.getByRole('button', { name: appName })).toBeTruthy();
   console.log('Navigated to ' +  appName.toString() + '- Success');
}

/**
 * Explicit wait for required seconds.
 * @param seconds #Seconds need to be waited.
 */
export const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));

/**
 * Wait to load global commandbar.
 * @param page Page reference.
 */
export async function waitForGlobalComamndBarLoad(page) {
	await page.waitForSelector(CommandBarGlobalButtonsSelectors.CommandBarSelector);
	// Wait for command buttons to be stable (Wait for last loading element).
   await page.waitForSelector(CommandBarGlobalButtonsSelectors.AccountManager);
}
/**
 * Expand global quick create flyout.
 * @param page Page reference.
 */
export async function expandGlobalQuickCreateFlyout(page) {
	// Wait to load global commandbar.
	await waitForGlobalComamndBarLoad(page);

	// Click on global quick create launcher button.
	const quickCreateLauncher = await page.waitForSelector(CommandBarGlobalButtonsSelectors.QuickCreateLauncher);
	await quickCreateLauncher.waitForElementState("stable");
	await quickCreateLauncher.click();

	// Wait to laod the quick create launcher flyout.
	await page.waitForSelector(CommandBarGlobalButtonsSelectors.QuickCreateLauncherFlyout);
}

/**
 * Open global quick create form.
 * @param page Page reference.
 * @param entityLogicalName Logical name of entity/activity, for which quick create form needs to be opened.
 * @param isActivity Is it activity - true/false. Default - false.
 * @param waitToLoadQuickCreateForm Wait to load quick create form. Default - `true`.
 */
export async function openGlobalQuickCreateForm(
	page,
	entityLogicalName,
	isActivity = false,
	waitToLoadQuickCreateForm = true
) {
	// Expand global quick create flyout.
	await expandGlobalQuickCreateFlyout(page);

	if (isActivity) {
		// Click on Activities button to get all the list of activities.
		await page.click(stringFormat(CommandBarGlobalButtonsSelectors.QuickCreateLauncherFlyoutButton, "Activities"));

		// Wait to load Activities flyout.
		await page.waitForSelector(CommandBarGlobalButtonsSelectors.QuickCreateLauncherActivitiesFlyout);
	}

	// Click on required entity/activity button to open the quick create form.
	await page.click(stringFormat(CommandBarGlobalButtonsSelectors.QuickCreateLauncherFlyoutButton, entityLogicalName));

	if (waitToLoadQuickCreateForm) {
		// Wait to laod the quick create form.
		await waitForQuickCreateFormLoad(page);
	}
}

/**
 * Wait to load the quick create form.
 * @param page Page reference.
 */
export async function waitForQuickCreateFormLoad(page) {
	// Wait for the dom-content load.
	await waitForDomContentLoad(page);

	// Wait for quick create form load.
	await page.waitForSelector(FormSelectors.QuickCreateFormSelector);

	// Wait until app is idle.
	await waitUntilAppIdle(page);
}
/**
 * Wait for dom-content load.
 * @param page Page reference.
 * @param loadTimeout Page load timeout. Default - 1 minute.
 */
export async function waitForDomContentLoad(
	page,
	loadTimeout= TimeOut.NavigationTimeout
) {
	await page.waitForLoadState(LoadState.DomContentLoaded, { timeout: loadTimeout });
}

/**
 * Load state conditions.
 */
export let LoadState
;(function(LoadState) {
  LoadState["DomContentLoaded"] = "domcontentloaded"
  LoadState["Load"] = "load"
  LoadState["NetworkIdle"] = "networkidle"
})(LoadState || (LoadState = {}))

/**
 * Timeout for multiple scenarios.
 */
export let TimeOut

;(function(TimeOut) {
  TimeOut[(TimeOut["DefaultLoopWaitTime"] = 5000)] = "DefaultLoopWaitTime"
  TimeOut[(TimeOut["DefaultWaitTime"] = 30000)] = "DefaultWaitTime"
  TimeOut[(TimeOut["DefaultMaxWaitTime"] = 180000)] = "DefaultMaxWaitTime"
  TimeOut[(TimeOut["DefaultWaitTimeForValidation"] = 30000)] =
    "DefaultWaitTimeForValidation"
  TimeOut[(TimeOut["ElementWaitTime"] = 2000)] = "ElementWaitTime"
  TimeOut[(TimeOut["ExpectRetryDefaultWaitTime"] = 30000)] =
    "ExpectRetryDefaultWaitTime"
  TimeOut[(TimeOut["LoadTimeOut"] = 60000)] = "LoadTimeOut"
  TimeOut[(TimeOut["NavigationTimeout"] = 60000)] = "NavigationTimeout"
  TimeOut[(TimeOut["PageLoadTimeOut"] = 30000)] = "PageLoadTimeOut"
  TimeOut[(TimeOut["TestTimeout"] = 360000)] = "TestTimeout"
  TimeOut[(TimeOut["TestTimeoutMax"] = 6000000)] = "TestTimeoutMax"
  TimeOut[(TimeOut["OneMinuteTimeOut"] = 60000)] = "OneMinuteTimeOut"
  TimeOut[(TimeOut["TwoMinutesTimeout"] = 120000)] = "TwoMinutesTimeout"
  TimeOut[(TimeOut["ThreeMinutesTimeout"] = 180000)] = "ThreeMinutesTimeout"
  TimeOut[(TimeOut["FourMinutesTimeout"] = 240000)] = "FourMinutesTimeout"
  TimeOut[(TimeOut["FiveMinutesTimeout"] = 300000)] = "FiveMinutesTimeout"
})(TimeOut || (TimeOut = {}))


