import {
  Context,
  DAL,
  FilterableSalesChannelProps,
  FindConfig,
  InternalModuleDeclaration,
  ISalesChannelModuleService,
  ModuleJoinerConfig,
  RestoreReturn,
  SalesChannelDTO,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  mapObjectTo,
  MedusaContext,
} from "@medusajs/utils"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

import { SalesChannel } from "@models"

import SalesChannelService from "./sales-channel"
import {
  joinerConfig,
  entityNameToLinkableKeysMap,
  LinkableKeys,
} from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  salesChannelService: SalesChannelService<any>
}

export default class SalesChannelModuleService<
  TEntity extends SalesChannel = SalesChannel
> implements ISalesChannelModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly salesChannelService_: SalesChannelService<TEntity>

  constructor(
    { baseRepository, salesChannelService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.salesChannelService_ = salesChannelService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectTransactionManager("baseRepository_")
  async create(
    data: CreateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannel = await this.salesChannelService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannel,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.salesChannelService_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async softDelete_(
    salesChannelIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    return await this.salesChannelService_.softDelete(
      salesChannelIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async softDelete<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    salesChannelIds: string[],
    { returnLinkableKeys }: SoftDeleteReturn<TReturnableLinkableKeys> = {},
    sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.softDelete_(
      salesChannelIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async restore_(
    salesChannelIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], Record<string, unknown[]>]> {
    return await this.salesChannelService_.restore(
      salesChannelIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async restore<
    TReturnableLinkableKeys extends string = Lowercase<
      keyof typeof LinkableKeys
    >
  >(
    salesChannelIds: string[],
    { returnLinkableKeys }: RestoreReturn<TReturnableLinkableKeys> = {},
    sharedContext: Context = {}
  ): Promise<Record<Lowercase<keyof typeof LinkableKeys>, string[]> | void> {
    const [_, cascadedEntitiesMap] = await this.restore_(
      salesChannelIds,
      sharedContext
    )

    let mappedCascadedEntitiesMap
    if (returnLinkableKeys) {
      mappedCascadedEntitiesMap = mapObjectTo<
        Record<Lowercase<keyof typeof LinkableKeys>, string[]>
      >(cascadedEntitiesMap, entityNameToLinkableKeysMap, {
        pick: returnLinkableKeys,
      })
    }

    return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
  }

  @InjectTransactionManager("baseRepository_")
  async update(
    data: UpdateSalesChannelDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannel = await this.salesChannelService_.update(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannel,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async retrieve(
    salesChannelId: string,
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO> {
    const salesChannel = await this.salesChannelService_.retrieve(
      salesChannelId,
      config
    )

    return await this.baseRepository_.serialize<SalesChannelDTO>(salesChannel, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async list(
    filters: {} = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<SalesChannelDTO[]> {
    const salesChannels = await this.salesChannelService_.list(filters, config)

    return await this.baseRepository_.serialize<SalesChannelDTO[]>(
      salesChannels,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: FilterableSalesChannelProps = {},
    config: FindConfig<SalesChannelDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[SalesChannelDTO[], number]> {
    const [salesChannels, count] = await this.salesChannelService_.listAndCount(
      filters,
      config
    )

    return [
      await this.baseRepository_.serialize<SalesChannelDTO[]>(salesChannels, {
        populate: true,
      }),
      count,
    ]
  }
}
