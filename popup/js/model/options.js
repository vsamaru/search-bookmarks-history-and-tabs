import { printError } from '../helper/utils.js'

/**
 * The default options
 *
 * They can be selectively overwritten and customized via user options
 * @see https://github.com/Fannon/search-tabs-bookmarks-and-history#user-configuration
 */
export const defaultOptions = {
  //////////////////////////////////////////
  // SEARCH OPTIONS                       //
  //////////////////////////////////////////

  /**
   * Search approach to use. Choose between:
   *
   * * 'precise': Simple search approach that will only find precise matches.
   *              It provides best init performance and provides good search performance.
   *              The 'fuzzyness' option will be ignored
   *
   * * 'fuzzy':   Search approach that implements a fuzzy (approximate) search.
   *              This search approach will find more results, even if there are no perfect matches.
   *              It has a moderate impact on init performance, and is slower when searching.
   *              It supports all options.
   *              Uses https://github.com/leeoniya/uFuzzy
   *
   * * 'hybrid':  Hybrid that uses both 'precise' and 'fuzzy' algorithms combined
   */
  searchStrategy: 'precise', // 'precise' or 'fuzzy' or 'hybrid'
  /**
   * Max search results. Reduce for better performance.
   * Does not apply for tag and folder search
   */
  searchMaxResults: 50,
  /**
   * Minimum string characters of the search term to consider a match
   */
  searchMinMatchCharLength: 1,
  /**
   * Fuzzy search threshold (0 - 1)
   * 0 is no fuzzyness, 1 is full fuzzyness
   *
   * This applies only to search approach 'fuzzy'.
   * For precise this is always 0 (no fuzzyness)
   */
  searchFuzzyness: 0.6,
  /**
   * How search matches are considered
   * 'startsWith' is only considering a match if the search term starts with the term
   * 'includes' also considers matches where the term is included anywhere.
   *
   * Setting this to 'includes' will increase the time for indexing (slower startup)
   *
   * This applies only to search approach 'precise'.
   * For fuzzy this is always 'includes'
   */
  searchPreciseMatchAlgorithm: 'startsWith', // or 'includes'

  //////////////////////////////////////////
  // SEARCH SOURCES                       //
  //////////////////////////////////////////

  /**
   * Whether to index and search for open browser tabs
   */
  enableTabs: true,
  /**
   * Whether to index and search for bookmarks
   */
  enableBookmarks: true,
  /**
   * Whether to index and search for browsing history
   * Please note that the history API tends to be slow,
   * so be careful about how many items you load.
   */
  enableHistory: true,
  /**
   * Enable or disable search engine links in results
   * Search engines can be a useful fallback mechanism to search externally for the term
   */
  enableSearchEngines: true,

  //////////////////////////////////////////
  // DISPLAY OPTIONS                      //
  //////////////////////////////////////////

  /**
   * Extract tags from title and display it as a badge with different search priority
   * Disabling this will also disable the tag overview and the tag search mode.
   */
  displayTags: true,
  /**
   * Display and search the folder names of bookmarks.
   * Disabling this will also disable the folder overview and the folder search mode.
   */
  displayFolderName: true,
  /**
   * Highlight search matches in results.
   * Reduces rendering performance a little.
   */
  displaySearchMatchHighlight: true,
  /**
   * Display last visit (time ago)
   */
  displayLastVisit: true,
  /**
   * Display how many times a result was visited (by history)
   */
  displayVisitCounter: false,
  /**
   * Display date when a bookmark was added
   */
  displayDateAdded: false,
  /**
   * Display result score.
   * The score indicates the relevance of the result and defines the order of results.
   */
  displayScore: true,

  //////////////////////////////////////////
  // TABS OPTIONS                         //
  //////////////////////////////////////////

  /**
   * If true, only the current browser window is considered for tab indexing and switching
   */
  tabsOnlyCurrentWindow: false,
  /**
   * When initializing search, show a certain number of tabs, sorted by last visited
   * Set this to 0 to disable.
   */
  tabsDisplayLastVisited: 0,
  /**
   * If true, the windowId of the tab result will be displayed
   * This can help to with multi-window situations
   * */
  tabsDisplayWindowId: false,

  //////////////////////////////////////////
  // HISTORY OPTIONS                      //
  //////////////////////////////////////////

  /**
   * How many days ago the browser history should be fetched
   */
  historyDaysAgo: 7,
  /**
   * How many history items should be fetched at most
   * Be careful, as too many items have negative impact on index and search performance
   */
  historyMaxItems: 512,
  /**
   * All history items that start with the URLs given here will be skipped
   *
   * @example
   * historyIgnoreList: ["http://localhost"]
   */
  historyIgnoreList: [],

  //////////////////////////////////////////
  // SEARCH ENGINES OPTIONS               //
  //////////////////////////////////////////

  /**
   * Search Engine "Providers" which are used to pass on the search term via URL
   *
   * For each entry here, one result will be created - in the order they are defined.
   * The URLs need to include the search querystring (see examples).
   */
  searchEngineChoices: [
    {
      name: 'Google',
      urlPrefix: 'https://www.google.com/search?q=',
    },
    {
      name: 'Bing',
      urlPrefix: 'https://www.bing.com/search?q=',
    },
    {
      name: 'DuckDuckGo',
      urlPrefix: 'https://duckduckgo.com/?q=',
    },
    {
      name: 'dict.cc',
      urlPrefix: 'https://www.dict.cc/?s=',
    },
  ],

  //////////////////////////////////////////
  // SCORE CALCULATION OPTIONS            //
  //////////////////////////////////////////

  /**
   * Filter out all search results below this minimum score
   */
  scoreMinScore: 30,
  /**
   * Minimum ratio of search term matches to consider a match.
   * Set to 1 to only return results that match all search terms
   * Set to 0 to return all results that match at least one search term, although with reduced score
   *
   * This setting only applies to precise search
   */
  scoreMinSearchTermMatchRatio: 0.6,

  // RESULT TYPE BASE SCORES
  // Depending on the type of result, they start with a base score
  // Please make sure that this is not below the minScore :)
  /**
   * Base score for bookmark results
   */
  scoreBookmarkBaseScore: 100,
  /**
   * Base score for tab results
   */
  scoreTabBaseScore: 70,
  /**
   * Base score for history results
   */
  scoreHistoryBaseScore: 50,
  /**
   * Base score for search engine choices
   */
  scoreSearchEngineBaseScore: 30,

  /**
   * If in hybrid mode, this is the score bonus or malus for precise results
   * This can be positive or negative
   */
  scoreHybridPreciseBonus: 40,
  /**
   * If in hybrid mode, this is the score bonus or malus for fuzzy results
   * This can be positive or negative
   */
  scoreHybridFuzzyBonus: -10,

  // FIELD WEIGHTS
  // Depending on in which field the search match was found,
  // the match gets a multiplier applied on how important the match is.
  /** Weight for a title match*/
  scoreTitleWeight: 1,
  /** Weight for a tag match*/
  scoreTagWeight: 0.7,
  /** Weight for an url match*/
  scoreUrlWeight: 0.6,
  /** Weight for a folder match*/
  scoreFolderWeight: 0.5,

  // BONUS SCORES
  // If certain conditions apply, extra score points can be added
  /**
   * If enabled, bookmarks can add custom bonus scores by putting it in the title
   * HowTo: Add a ` +<score>` (space, plus sign, whole number) in the title before tags.
   * Do not add bonus scores more than once in a single bookmark title.
   * E.g: `Bookmark Title +20` or `Another Bookmark +10 #tag1 #tag2`
   * */
  scoreCustomBonusScore: true,
  /**
   * For each exact "includes" match we add some bonus points
   */
  scoreExactIncludesBonus: 5,
  /**
   * The minimum characters a search term needs to have to consider a exact includes match
   */
  scoreExactIncludesBonusMinChars: 3,
  /**
   * Additional score points if title or url starts exactly with the search text.
   * This comes on top of an include bonus.
   */
  scoreExactStartsWithBonus: 10,
  /**
   * Additional score points if title matches exactly with the search text.
   * This comes on top of an include and starts with bonus.
   */
  scoreExactEqualsBonus: 15,
  /**
   * Additional points for an exact match of a search term tag
   */
  scoreExactTagMatchBonus: 10,
  /**
   * Additional points for an exact match of a search term folder name
   */
  scoreExactFolderMatchBonus: 5,
  /**
   * Adds score points for every site visit according to browsing history
   * Please note that only history items within `history.daysAgo` can be considered,
   * however the visited counter itself considers your complete history.
   */
  scoreVisitedBonusScore: 0.25,
  /**
   * Maximum score points for visited bonus
   */
  scoreVisitedBonusScoreMaximum: 10,
  /**
   * Adds score points when a bookmark or history has been accessed recently.
   * Calculated by taking the recentBonusScoreMaximum and subtract recentBonusScorePerHour
   * for each hour the access happened in the past.
   * There is no negative score.
   *
   * Example: If maximum is 24 and perHour is 0.5:
   * * For a page just opened there will be ~20 bonus score
   * * For a page opened 24 hours ago there will be 10 bonus score
   * * For a page opened 48 hours ago there will be 0 bonus score
   */
  scoreRecentBonusScorePerHour: 0.5,
  scoreRecentBonusScoreMaximum: 20,
  /**
   * Adds score points when a bookmark has been added more recently.
   * Calculated by taking the dateAddedBonusScoreMaximum and subtract dateAddedBonusScorePerDay
   * for each day the bookmark has been added in the past.
   * There is no negative score.
   */
  scoreDateAddedBonusScorePerDay: 0.1,
  scoreDateAddedBonusScoreMaximum: 5,
}

/**
 * If there are no options yet, use this as an empty options template
 */
export const emptyOptions = {
  searchStrategy: defaultOptions.searchStrategy,
}

/**
 * Writes user settings to the google chrome sync storage
 *
 * @see https://developer.chrome.com/docs/extensions/reference/storage/
 */
export async function setUserOptions(userOptions) {
  return new Promise((resolve, reject) => {
    userOptions = userOptions || {}

    try {
      validateUserOptions(userOptions)
    } catch (err) {
      printError(err, 'Could not save user options.')
      return reject(err)
    }

    if (ext.browserApi.storage) {
      ext.browserApi.storage.sync.set({ userOptions: userOptions }, () => {
        if (ext.browserApi.runtime.lastError) {
          return reject(ext.browserApi.runtime.lastError)
        }
        return resolve()
      })
    } else {
      console.warn('No storage API found. Falling back to local Web Storage')
      window.localStorage.setItem('userOptions', JSON.stringify(userOptions))
      return resolve()
    }
  })
}

/**
 * Get user options.
 * If none are stored yet, this will return the default empty options
 */
export async function getUserOptions() {
  return new Promise((resolve, reject) => {
    try {
      if (ext.browserApi.storage && ext.browserApi.storage.sync && ext.browserApi.storage.sync.get) {
        ext.browserApi.storage.sync.get(['userOptions'], (result) => {
          if (ext.browserApi.runtime.lastError) {
            return reject(ext.browserApi.runtime.lastError)
          }
          return resolve(result.userOptions || emptyOptions)
        })
      } else {
        console.warn('No storage API found. Falling back to local Web Storage')
        const userOptions = window.localStorage.getItem('userOptions')
        return resolve(userOptions ? JSON.parse(userOptions) : emptyOptions)
      }
    } catch (err) {
      return reject(err)
    }
  })
}

/**
 * Gets the actual effective options based on the default options
 * and the overrides of the user options
 */
export async function getEffectiveOptions() {
  try {
    const userOptions = await getUserOptions()
    validateUserOptions(userOptions)
    return {
      ...defaultOptions,
      ...userOptions,
    }
  } catch (err) {
    printError(err, 'Could not get valid user options, falling back to defaults.')
    return defaultOptions
  }
}

export function validateUserOptions(userOptions) {
  if (userOptions) {
    if (typeof userOptions !== 'object') {
      throw new Error('User options must be a valid YAML / JSON object')
    }
    try {
      JSON.stringify(userOptions)
    } catch (err) {
      throw new Error('User options cannot be parsed into JSON: ' + err.message)
    }
  }
}
