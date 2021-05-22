import { HttpClient, HttpErrorResponse } from "@angular/common/http";

export class BackendRoutes {
    static ExchangeRateRoute = "/get-exchange-rate";
    static BurnBitcoinRoute = "/burn-bitcoin";
    static SendBitCloutRoute = "/send-bitclout";
    static MinerControlRoute = "/miner-control";

    static GetUsersStatelessRoute = "/get-users-stateless";
    static RoutePathSubmitPost = "/submit-post";
    static RoutePathSubmitTransaction = "/submit-transaction";
    static RoutePathUpdateProfile = "/update-profile";
    static RoutePathGetPostsStateless = "/get-posts-stateless";
    static RoutePathGetProfiles = "/get-profiles";
    static RoutePathGetSingleProfile = "/get-single-profile";
    static RoutePathGetPostsForPublicKey = "/get-posts-for-public-key";
    static RoutePathGetHodlersForPublicKey = "/get-hodlers-for-public-key";
    static RoutePathSendMessageStateless = "/send-message-stateless";
    static RoutePathGetMessagesStateless = "/get-messages-stateless";
    static RoutePathGetFollowsStateless = "/get-follows-stateless";
    static RoutePathCreateFollowTxnStateless = "/create-follow-txn-stateless";
    static RoutePathCreateLikeStateless = "/create-like-stateless";
    static RoutePathBuyOrSellCreatorCoin = "/buy-or-sell-creator-coin-WVAzTWpGOFFnMlBvWXZhTFA4NjNSZGNW";
    static RoutePathBuyOrSellCreatorCoinPreview = "/buy-or-sell-creator-coin-preview-WVAzTWpGOFFnMlBvWXZhTFA4NjNSZGNW";
    static RoutePathTransferCreatorCoin = "/transfer-creator-coin";
    static RoutePathUpdateUserGlobalMetadata = "/update-user-global-metadata";
    static RoutePathGetUserGlobalMetadata = "/get-user-global-metadata";
    static RoutePathGetNotifications = "/get-notifications";
    static RoutePathGetAppState = "/get-app-state";
    static RoutePathGetSinglePost = "/get-single-post";
    static RoutePathSendPhoneNumberVerificationText = "/send-phone-number-verification-text";
    static RoutePathSubmitPhoneNumberVerificationCode = "/submit-phone-number-verification-code";
    static RoutePathBlockPublicKey = "/block-public-key";
    static RoutePathGetBlockTemplate = "/get-block-template";
    static RoutePathGetTxn = "/get-txn";
    static RoutePathGetIdentities = "/get-identities";
    static RoutePathDeleteIdentities = "/delete-identities";

    // Admin routes.
    static NodeControlRoute = "/admin/node-control";
    static ReprocessBitcoinBlockRoute = "/admin/reprocess-bitcoin-block";
    static RoutePathSwapIdentity = "/admin/swap-identity";
    static RoutePathAdminUpdateUserGlobalMetadata = "/admin/update-user-global-metadata";
    static RoutePathAdminGetAllUserGlobalMetadata = "/admin/get-all-user-global-metadata";
    static RoutePathAdminGetUserGlobalMetadata = "/admin/get-user-global-metadata";
    static RoutePathAdminUpdateGlobalFeed = "/admin/update-global-feed";
    static RoutePathAdminPinPost = "/admin/pin-post";
    static RoutePathAdminRemoveNilPosts = "/admin/remove-nil-posts";
    static RoutePathAdminGetMempoolStats = "/admin/get-mempool-stats";
    static RoutePathAdminGrantVerificationBadge = "/admin/grant-verification-badge";
    static RoutePathAdminRemoveVerificationBadge = "/admin/remove-verification-badge";
    static RoutePathAdminGetVerifiedUsers = "/admin/get-verified-users";
    static RoutePathAdminGetUsernameVerificationAuditLogs = "/admin/get-username-verification-audit-logs";
    static RoutePathUpdateBitcoinUSDExchangeRate = "/admin/update-bitcoin-usd-exchange-rate";
    static RoutePathUpdateGlobalParams = "/admin/update-global-params";
    static RoutePathGetGlobalParams = "/admin/get-global-params";
}

export class BackendApiService {
    constructor(HttpClient, IdentityService) {}

    // Assemble a URL to hit the BE with.
    _makeRequestURL(endpoint, routeName, adminPublicKey) {
        let queryURL = location.protocol + "//" + endpoint + routeName;
        // If the protocol is specified within the endpoint then use that.
        if (endpoint.startsWith("http")) {
            queryURL = endpoint + routeName;
        }
        if (adminPublicKey) {
            queryURL += `?admin_public_key=${adminPublicKey}`;
        }
        return queryURL;
    }

    signAndSubmitTransaction(endpoint, request, PublicKeyBase58Check) {
        return request.pipe(
            switchMap((res) =>
                this.identityService
                .sign({
                    transactionHex: res.TransactionHex,
                    ...this.identityService.identityServiceParamsForKey(PublicKeyBase58Check),
                })
                .pipe(
                    switchMap((signed) => {
                    if (signed.approvalRequired) {
                        return this.identityService
                        .launch("/approve", {
                            tx: res.TransactionHex,
                        })
                        .pipe(
                            map((approved) => {
                            this.setIdentityServiceUsers(approved.users);
                            return { ...res, ...approved };
                            })
                        );
                    } else {
                        return of({ ...res, ...signed });
                    }
                    })
                )
            )
            )
            .pipe(
            switchMap((res) =>
                this.SubmitTransaction(endpoint, res.signedTransactionHex).pipe(
                map((broadcasted) => ({ ...res, ...broadcasted }))
                )
            )
            )
            .pipe(catchError(this._handleError));
    }

    get(endpoint, path) {
        return this.httpClient.get(this._makeRequestURL(endpoint, path)).pipe(catchError(this._handleError));
    }

    post(endpoint, path, body) {
        return this.httpClient.post(this._makeRequestURL(endpoint, path), body).pipe(catchError(this._handleError));
    }

    static GET_PROFILES_ORDER_BY_INFLUENCER_COIN_PRICE = "influencer_coin_price";
    static BUY_CREATOR_COIN_OPERATION_TYPE = "buy";
    static SELL_CREATOR_COIN_OPERATION_TYPE = "sell";

    // TODO: Cleanup - this should be a configurable value on the node. Leaving it in the frontend
    // is fine for now because BlockCypher has strong anti-abuse measures in place.
    blockCypherToken = "cd455c8a5d404bb0a23880b72f56aa86";

    // Store sent messages and associated metadata in localStorage
    MessageMetaKey = "messageMetaKey";

    // Store successful identityService.import result in localStorage
    IdentityImportCompleteKey = "identityImportComplete";

    // Store the identity users in localStorage
    IdentityUsersKey = "identityUsers";

    // Store last local node URL in localStorage
    LastLocalNodeKey = "lastLocalNode";

    // Store last logged in user public key in localStorage
    LastLoggedInUserKey = "lastLoggedInUser";

    // Store the last identity service URL in localStorage
    LastIdentityServiceKey = "lastIdentityServiceURL";

    // TODO: Wipe all this data when transition is complete
    LegacyUserListKey = "userList";
    LegacySeedListKey = "seedList";

          // TODO: Use Broadcast bool isntead
    SendBitCloutPreview(
        endpoint,
        SenderPublicKeyBase58Check,
        RecipientPublicKeyOrUsername,
        AmountNanos,
        MinFeeRateNanosPerKB
    ){
        return this.post(endpoint, BackendRoutes.SendBitCloutRoute, {
            SenderPublicKeyBase58Check,
            RecipientPublicKeyOrUsername,
            AmountNanos: Math.floor(AmountNanos),
            MinFeeRateNanosPerKB,
        });
    }

    SendBitClout(
        endpoint,
        SenderPublicKeyBase58Check,
        RecipientPublicKeyOrUsername,
        AmountNanos,
        MinFeeRateNanosPerKB
      ){
        const request = this.SendBitCloutPreview(
          endpoint,
          SenderPublicKeyBase58Check,
          RecipientPublicKeyOrUsername,
          AmountNanos,
          MinFeeRateNanosPerKB
        );

        return this.signAndSubmitTransaction(endpoint, request, SenderPublicKeyBase58Check);
      }

}