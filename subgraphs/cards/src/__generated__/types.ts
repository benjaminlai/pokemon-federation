import { GraphQLResolveInfo } from 'graphql';
import { PokemonRef, CardModel, PriceModel, ContextValue } from '../subgraph.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: unknown; output: unknown; }
};

export type Pokemon = {
  __typename?: 'Pokemon';
  cards: Array<PokemonCard>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


export type PokemonCardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type PokemonCard = {
  __typename?: 'PokemonCard';
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price?: Maybe<Price>;
  rarity?: Maybe<Scalars['String']['output']>;
  setName?: Maybe<Scalars['String']['output']>;
};

export type Price = {
  __typename?: 'Price';
  high?: Maybe<Scalars['Float']['output']>;
  low?: Maybe<Scalars['Float']['output']>;
  market?: Maybe<Scalars['Float']['output']>;
  mid?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  cardsByName: Array<PokemonCard>;
};


export type QueryCardsByNameArgs = {
  name: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of federation types */
export type FederationTypes = {
  Pokemon: Pokemon;
};

/** Mapping of federation reference types */
export type FederationReferenceTypes = {
  Pokemon:
    ( { __typename: 'Pokemon' }
    & GraphQLRecursivePick<FederationTypes['Pokemon'], {"id":true}>
    & ( Record<PropertyKey, never>
        | GraphQLRecursivePick<FederationTypes['Pokemon'], {"name":true}> ) );
};



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Pokemon: ResolverTypeWrapper<PokemonRef>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  PokemonCard: ResolverTypeWrapper<CardModel>;
  Price: ResolverTypeWrapper<PriceModel>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Pokemon: PokemonRef;
  Int: Scalars['Int']['output'];
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  PokemonCard: CardModel;
  Price: PriceModel;
  Float: Scalars['Float']['output'];
  Query: Record<PropertyKey, never>;
  Boolean: Scalars['Boolean']['output'];
};

export type PokemonResolvers<ContextType = ContextValue, ParentType extends ResolversParentTypes['Pokemon'] = ResolversParentTypes['Pokemon'], FederationReferenceType extends FederationReferenceTypes['Pokemon'] = FederationReferenceTypes['Pokemon']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Pokemon']> | FederationReferenceType, FederationReferenceType, ContextType>;
  cards?: Resolver<Array<ResolversTypes['PokemonCard']>, ParentType, ContextType, RequireFields<PokemonCardsArgs, 'limit'>>;
};

export type PokemonCardResolvers<ContextType = ContextValue, ParentType extends ResolversParentTypes['PokemonCard'] = ResolversParentTypes['PokemonCard']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Price']>, ParentType, ContextType>;
  rarity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PriceResolvers<ContextType = ContextValue, ParentType extends ResolversParentTypes['Price'] = ResolversParentTypes['Price']> = {
  high?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  low?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  market?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  mid?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ContextValue, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  cardsByName?: Resolver<Array<ResolversTypes['PokemonCard']>, ParentType, ContextType, RequireFields<QueryCardsByNameArgs, 'name' | 'page' | 'pageSize'>>;
};

export type Resolvers<ContextType = ContextValue> = {
  Pokemon?: PokemonResolvers<ContextType>;
  PokemonCard?: PokemonCardResolvers<ContextType>;
  Price?: PriceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

