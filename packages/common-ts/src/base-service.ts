/* Imports: Internal */
import { Logger } from './common/logger'
import { Metrics } from './common/metrics'

type OptionSettings<TOptions> = {
  [P in keyof TOptions]?: {
    default?: TOptions[P]
    validate?: (val: any) => boolean
  }
}

type BaseServiceOptions<T> = T & {
  logger?: Logger
  metrics?: Metrics
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Base for other "Service" objects. Handles your standard initialization process, can dynamically
 * start and stop.
 */
export class BaseService<T> {
  protected name: string
  protected options: T
  protected logger: Logger
  protected metrics: Metrics
  protected initialized = false
  protected running = false
  protected waitForShutdown = false

  constructor(
    name: string,
    options: BaseServiceOptions<T>,
    optionSettings: OptionSettings<T>
  ) {
    validateOptions(options, optionSettings)
    this.name = name
    this.options = mergeDefaultOptions(options, optionSettings)
    this.logger = options.logger || new Logger({ name })
    if (options.metrics) {
      this.metrics = options.metrics
    }
  }

  /**
   * Initializes the service.
   */
  public async init(): Promise<void> {
    if (this.initialized) {
      return
    }

    this.logger.info(`Service ${this.name} is initializing...`)
    await this._init()
    this.logger.info(`Service ${this.name} has initialized.`)
    this.initialized = true
  }

  /**
   * Starts the service (initializes it if needed).
   */
  public async start(): Promise<void> {
    if (this.running) {
      return
    }
    this.logger.info(`Service ${this.name} is starting...`)
    await this.init()

    // set the service to running
    this.running = true
    await this._start()
    this.waitForShutdown = true
    this.logger.info(`Service ${this.name} can stop now`)
  }

  /**
   * Stops the service.
   */
  public async stop(): Promise<void> {
    if (!this.running) {
      return
    }

    this.logger.info(`Service ${this.name} is stopping...`)
    this.running = false
    await this._stop()
    while (!this.waitForShutdown) {
      await sleep(100)
    }
    this.logger.info(`Service ${this.name} has stopped`)
  }

  /**
   * Internal init function. Parent should implement.
   */
  protected async _init(): Promise<void> {
    return
  }

  /**
   * Internal start function. Parent should implement.
   */
  protected async _start(): Promise<void> {
    return
  }

  /**
   * Internal stop function. Parent should implement.
   */
  protected async _stop(): Promise<void> {
    return
  }
}

/**
 * Combines user provided and default options.
 */
const mergeDefaultOptions = <T>(
  options: T,
  optionSettings: OptionSettings<T>
): T => {
  for (const optionName of Object.keys(optionSettings)) {
    const optionDefault = optionSettings[optionName].default
    if (optionDefault === undefined) {
      continue
    }

    if (options[optionName] !== undefined && options[optionName] !== null) {
      continue
    }

    options[optionName] = optionDefault
  }

  return options
}

/**
 * Performs option validation against the option settings
 */
const validateOptions = <T>(options: T, optionSettings: OptionSettings<T>) => {
  for (const optionName of Object.keys(optionSettings)) {
    const optionValidationFunction = optionSettings[optionName].validate
    if (optionValidationFunction === undefined) {
      continue
    }

    const optionValue = options[optionName]

    if (optionValidationFunction(optionValue) === false) {
      throw new Error(
        `Provided input for option "${optionName}" is invalid: ${optionValue}`
      )
    }
  }
}
