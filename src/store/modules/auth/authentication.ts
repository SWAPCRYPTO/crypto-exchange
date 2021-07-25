import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'
import { useRouter } from 'vue-router'
import firebase from '../../../firebase'
import router from '@/router'
import { convertCurrency } from '@/services/ConvertCurrency'
import { openToast } from '@/services/OpenToast'
import Asset from '../assets/models/Asset'
import User from './models/User'
import UserAccount, { PortfolioItem } from './models/UserAccount'
import UserSettings from './models/UserSettings'
import Big from 'big.js'
import { RootState } from '@/store'

const openErrorToast = (message: string) => {
    openToast(message, 'bottom', 4000)
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    authError: string
    loading: boolean
}

const state: AuthState = {
    user: null,
    isAuthenticated: true,
    authError: '',
    loading: false,
}

export enum AuthMutationTypes {
    setUser = 'setUser',
    setUserName = 'setUsername',
    setSettings = 'setSettings',
    setWatchedAssets = 'setWatchedAssets',
    setPreferredCurrency = 'setPreferredCurrency',
    setLoading = 'setLoading',
    setAuthError = 'setAuthError',
    clearError = 'clearError',
}

export type AuthMutations<S = AuthState> = {
    [AuthMutationTypes.setUser](state: S, payload: User): void
    [AuthMutationTypes.setUserName](state: S, payload: string): void
    [AuthMutationTypes.setSettings](state: S, payload: UserSettings): void
    [AuthMutationTypes.setWatchedAssets](state: S, payload: string[]): void
    [AuthMutationTypes.setPreferredCurrency](state: S, payload: string): void
    [AuthMutationTypes.setLoading](state: S, payload: boolean): void
    [AuthMutationTypes.setAuthError](state: S, payload: string): void
    [AuthMutationTypes.clearError](state: S): void
}

const mutations: MutationTree<AuthState> & AuthMutations = {
    setUser(state: AuthState, payload: User) {
        state.user = payload
    },
    setUsername(state: AuthState, payload: string) {
        if (state.user?.name) {
            state.user.name = payload
        }
    },
    setSettings(state: AuthState, payload: UserSettings) {
        if (state.user?.settings) {
            state.user.settings = payload
        }
    },
    setWatchedAssets(state: AuthState, payload: string[]) {
        if (state.user?.account) {
            state.user.account.watchedAssets = payload
        }
    },
    setPreferredCurrency(state: AuthState, payload: string) {
        if (state.user?.account) {
            state.user.account.preferredCurrency = payload
        }
    },
    setLoading(state: AuthState, payload: boolean) {
        state.loading = payload
    },
    setAuthError(state: AuthState, payload: string) {
        state.authError = payload
    },
    clearError(state: AuthState) {
        state.authError = ''
    },
}

export type AuthGetters = {
    user: (state: AuthState) => User | null
    loading: (state: AuthState) => boolean
    authError: (state: AuthState) => string
    isVerfied: () => boolean | undefined
    userBalance: (state: AuthState) => number | undefined
    userPortfolio: (state: AuthState) => PortfolioItem[] | undefined
    preferredCurrency: (state: AuthState) => string | undefined
    watchedAssets: (state: AuthState) => string[] | null | undefined
}

const getters: GetterTree<AuthState, RootState> & AuthGetters = {
    user: (state) => state.user,
    loading: (state) => state.loading,
    authError: (state) => state.authError,
    isVerfied: () => firebase.auth().currentUser?.emailVerified,
    userBalance: (state) => state.user?.account.balance,
    userPortfolio: (state) => state.user?.account.portfolio,
    preferredCurrency: (state) => state.user?.account.preferredCurrency,
    watchedAssets: (state) => state.user?.account.watchedAssets,
}

export enum AuthActionTypes {
    signUserIn = 'signUserIn',
    signUserUp = 'signUserUp',
    signUserOut = 'signUserOut',
    autoSignUserIn = 'autoSignUserIn',
    updateUserAccount = 'updateUserAccount',
    changeEmail = 'changeEmail',
    changePassword = 'changePassword',
    deleteAccount = 'deleteAccount',
    buyAsset = 'buyAsset',
    sellAsset = 'sellAsset',
    convertAsset = 'convertAsset',
}

type AugmentedActionContext = {
    commit<K extends keyof AuthMutations>(key: K, payload?: Parameters<AuthMutations[K]>[1]): ReturnType<AuthMutations[K]>
} & Omit<ActionContext<AuthState, RootState>, 'commit'>

export interface AuthActions {
    [AuthActionTypes.signUserIn]({ commit }: AugmentedActionContext, payload: { email: string; password: string }): void
    [AuthActionTypes.signUserUp]({ commit }: AugmentedActionContext, payload: { name: string; email: string; password: string }): void
    [AuthActionTypes.signUserOut]({ commit }: AugmentedActionContext): void
    [AuthActionTypes.autoSignUserIn]({ commit }: AugmentedActionContext, payload: firebase.User): void
    [AuthActionTypes.updateUserAccount]({ commit, state }: { commit: AugmentedActionContext; state: AuthState }, payload: UserAccount): void
    [AuthActionTypes.changeEmail]({ commit, dispatch, state }: { commit: AugmentedActionContext; dispatch: any; state: AuthState }, payload: { newEmail: string }): void
    [AuthActionTypes.changePassword]({ commit, dispatch }: { commit: AugmentedActionContext; dispatch: any }, payload: { email: string }): void
    [AuthActionTypes.deleteAccount]({ commit, dispatch, state }: { commit: AugmentedActionContext; dispatch: any; state: AuthState }): void
    [AuthActionTypes.buyAsset]({ commit, dispatch, state }: { commit: AugmentedActionContext; dispatch: any; state: AuthState }, payload: PortfolioItem): void
    [AuthActionTypes.sellAsset]({ commit, dispatch, state }: { commit: AugmentedActionContext; dispatch: any; state: AuthState }, payload: { symbol: string }): void
    [AuthActionTypes.convertAsset](
        { commit, dispatch, state, rootGetters }: { commit: AugmentedActionContext; dispatch: any; state: AuthState; rootGetters: any },
        payload: { currentAssetSymbol: string; conversionAsset: PortfolioItem }
    ): void
}

// const actions: ActionTree<AuthState, RootState> & AuthActions = {
const actions: ActionTree<AuthState, RootState> = {
    async signUserIn({ commit }, payload: { email: string; password: string }) {
        commit(AuthMutationTypes.setLoading, true)
        commit(AuthMutationTypes.clearError)

        await firebase
            .auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then((response) => {
                if (response?.user) {
                    const { uid } = response.user
                    const usersRef = firebase.firestore().collection('users')

                    usersRef.doc(uid).onSnapshot(
                        (snapshot) => {
                            if (!snapshot.exists) {
                                console.error("User doesn't exist.")
                                commit(AuthMutationTypes.setAuthError, "User doesn't exist.")
                            } else {
                                const newUser = snapshot.data() as User
                                commit(AuthMutationTypes.setUser, newUser)
                                commit(AuthMutationTypes.setLoading, false)
                            }
                        },
                        (e: Error) => {
                            const error = "User doesn't exist."
                            commit(AuthMutationTypes.setLoading, false)
                            commit(AuthMutationTypes.setAuthError, error)
                            openErrorToast(error)
                            console.error(e)
                        }
                    )
                } else {
                    const error = 'Error while connecting to the servers. Wait for some time or contact the administrator.'
                    commit(AuthMutationTypes.setLoading, false)
                    commit(AuthMutationTypes.setAuthError, error)
                    openErrorToast(error)
                    console.error(error)
                }
            })
            .catch((e: firebase.auth.Error) => {
                let error = ''
                commit('setLoading', false)
                if (e.code == 'auth/network-request-failed') {
                    error = 'Network error occured. Try connecting to the internet.'
                    commit(AuthMutationTypes.setAuthError, error)
                } else {
                    error = e.message
                    commit(AuthMutationTypes.setAuthError, error)
                }

                openErrorToast(error)
            })
    },
    async signUserUp({ commit }, payload: { name: string; email: string; password: string }) {
        commit(AuthMutationTypes.setLoading, true)
        commit(AuthMutationTypes.clearError)
        await firebase
            .auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then((response) => {
                if (response?.user) {
                    const { uid } = response.user
                    const newUser: User = {
                        id: uid,
                        email: payload.email,
                        name: payload.name,
                        account: {
                            balance: 0,
                            portfolio: [],
                            preferredCurrency: 'USD',
                            watchedAssets: [],
                        },
                        settings: {
                            notifications: true,
                        },
                    }
                    commit(AuthMutationTypes.setUser, newUser)
                    commit(AuthMutationTypes.setLoading, false)
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .set(newUser)
                        .catch((e: firebase.auth.Error) => {
                            commit(AuthMutationTypes.setLoading, false)
                            commit(AuthMutationTypes.setAuthError, e.message)
                            openErrorToast(e.message)
                            console.error(e)
                        })
                }
            })
            .catch((e: firebase.auth.Error) => {
                commit(AuthMutationTypes.setAuthError, e.message)
                if (e.code === 'auth/email-already-in-use') {
                    openErrorToast('This email is already in use.')
                    console.error(e)
                } else {
                    openErrorToast('Error occured. Try again later or contact the administrator.')
                    console.error(e)
                }
                commit(AuthMutationTypes.setLoading, false)
            })
    },
    async signUserOut({ commit }) {
        commit(AuthMutationTypes.setLoading, true)
        // detach a real-time listener to prevent missing or insufficient permissions
        await firebase
            .auth()
            .signOut()
            .then(() => {
                commit(AuthMutationTypes.setUser, null)
                commit(AuthMutationTypes.setLoading, false)
                router.push('/')
            })
    },
    async autoSignUserIn({ commit }, payload: firebase.User) {
        commit(AuthMutationTypes.setLoading, true)
        const cachedUserId = payload.uid
        firebase
            .firestore()
            .collection('users')
            .doc(cachedUserId)
            .onSnapshot(
                (snapshot) => {
                    const retrievedUser = snapshot.data() as User
                    commit(AuthMutationTypes.setUser, retrievedUser)
                    commit(AuthMutationTypes.setLoading, false)
                },
                (e: firebase.auth.Error) => {
                    commit(AuthMutationTypes.setLoading, false)
                    commit(AuthMutationTypes.setAuthError, e.message)
                    openErrorToast(e.message)
                    console.error(e)
                }
            )
    },
    async updateUserAccount({ commit, state }, payload: UserAccount) {
        if (state.user) {
            commit(AuthMutationTypes.setLoading, true)
            commit(AuthMutationTypes.clearError)
            await firebase
                .firestore()
                .collection('users')
                .doc(state.user.id)
                .update({ account: payload })
                .catch((e: firebase.auth.Error) => {
                    commit(AuthMutationTypes.setLoading, false)
                    commit(AuthMutationTypes.setAuthError, e.message)
                    console.error(e)
                })
            commit(AuthMutationTypes.setLoading, false)
        }
    },
    async changeEmail({ commit, dispatch, state }, payload: { newEmail: string }) {
        commit(AuthMutationTypes.setLoading, true)
        const user = firebase.auth().currentUser
        if (user)
            user.updateEmail(payload.newEmail)
                .then(async () => {
                    const uid = user.uid
                    await firebase
                        .firestore()
                        .collection('users')
                        .doc(uid)
                        .update({ email: payload.newEmail })
                        .catch((e: firebase.auth.Error) => {
                            commit(AuthMutationTypes.setLoading, false)
                            commit(AuthMutationTypes.setAuthError, e.message)
                            console.error(e)
                        })
                    commit(AuthMutationTypes.setLoading, false)
                    if (state.user) {
                        dispatch(AuthActionTypes.signUserOut)
                    } else {
                        const router = useRouter()
                        router.push('/')
                    }
                })
                .catch((e: firebase.auth.Error) => {
                    commit(AuthMutationTypes.setLoading, false)
                    commit(AuthMutationTypes.setAuthError, e.message)
                    console.error(e)
                    if (e.code === 'auth/email-already-in-use') {
                        openErrorToast('Provided email is occupied. Please choose another one.')
                    } else if (e.code === 'auth/requires-recent-login') {
                        // handle reauthentication if needed
                        // dispatch("setReauthenticationDialog", true);
                    }
                })
    },
    async changePassword({ commit, dispatch }, payload: { email: string }) {
        commit(AuthMutationTypes.setLoading, true)
        firebase
            .auth()
            .sendPasswordResetEmail(payload.email)
            .then(() => {
                commit(AuthMutationTypes.setLoading, false)
                if (state.user) {
                    dispatch(AuthActionTypes.signUserOut)
                } else {
                    const router = useRouter()
                    router.push('/')
                }
                // Notify.create({
                //   type: "positive",
                //   message: `Reset message sent to email.`,
                // });
            })
            .catch((e: firebase.auth.Error) => {
                commit(AuthMutationTypes.setLoading, false)
                commit(AuthMutationTypes.setAuthError, e.message)
                if (e.code === 'auth/requires-recent-login') {
                    console.error('Reauthentication needed to perform this action.')
                    // dispatch("setReauthenticationDialog", true);
                } else {
                    openErrorToast(e.message)
                }
            })
    },
    async deleteAccount({ commit, dispatch, state }) {
        commit(AuthMutationTypes.setLoading, false)
        const user = firebase.auth().currentUser
        if (user) {
            const uid = user.uid
            user.delete()
                .then(() => {
                    commit(AuthMutationTypes.setLoading, false)
                    if (state.user) {
                        dispatch(AuthActionTypes.signUserOut)
                    } else {
                        const router = useRouter()
                        router.push('/')
                    }
                    const user = firebase.firestore().collection('users').doc(uid)
                    user.delete()
                    // Notify.create({
                    //   type: "positive",
                    //   message: `Account removed.`,
                    // });
                })
                .catch((e: firebase.auth.Error) => {
                    commit(AuthMutationTypes.setLoading, false)
                    commit(AuthMutationTypes.setAuthError, e.message)
                    if (e.code === 'auth/requires-recent-login') {
                        console.error('Reauthentication needed to perform this action.')
                        // dispatch("setReauthenticationDialog", true);
                    } else {
                        openErrorToast(e.message)
                    }
                })
        }
    },
    async buyAsset({ commit, dispatch, state }, payload: PortfolioItem) {
        const { user } = state
        if (user) {
            commit(AuthMutationTypes.setLoading, true)
            commit(AuthMutationTypes.clearError)
            const portfolio = user.account.portfolio
            const assetExists = portfolio.find((asset) => asset.symbol === payload.symbol)

            if (assetExists) {
                // assetExists.quantity += payload.quantity
                assetExists.quantity = Big(assetExists.quantity).plus(payload.quantity).toNumber()
                assetExists.transactions.push(...payload.transactions)
            } else {
                portfolio.push(payload)
            }

            await dispatch(AuthActionTypes.updateUserAccount, user.account)
            commit(AuthMutationTypes.setLoading, false)
        }
    },
    async sellAsset({ commit, dispatch, state }, payload: { symbol: string }) {
        const { user } = state
        const { symbol } = payload
        if (user) {
            commit(AuthMutationTypes.setLoading, true)
            commit(AuthMutationTypes.clearError)
            let portfolio = user.account.portfolio
            portfolio = portfolio.filter((asset) => asset.symbol !== symbol)

            await dispatch(AuthActionTypes.updateUserAccount, { ...user.account, portfolio })
            commit(AuthMutationTypes.setLoading, false)
        }
    },
    async convertAsset({ commit, dispatch, state, rootGetters }, payload: { currentAssetSymbol: string; conversionAsset: PortfolioItem }) {
        const { user } = state
        const { currentAssetSymbol, conversionAsset } = payload
        if (user) {
            commit(AuthMutationTypes.setLoading, true)
            commit(AuthMutationTypes.clearError)

            let portfolio = user.account.portfolio
            const currentAsset = portfolio.find((asset) => asset.symbol === currentAssetSymbol)
            const currentAssetPrice: number = rootGetters.assets.find((asset: Asset) => asset.symbol == currentAssetSymbol).current_price

            if (currentAsset) {
                // conversionAsset.quantity is provided in a currency before conversion (currentAsset)
                currentAsset.quantity = Big(currentAsset?.quantity).minus(conversionAsset.quantity).toNumber()
                if (currentAsset.quantity == 0) {
                    portfolio = portfolio.filter((asset) => asset.symbol !== currentAssetSymbol)
                } else {
                    // keep the history and add negative transaction
                    const currentAssetTransaction = {
                        purchasePrice: currentAssetPrice,
                        quantity: -conversionAsset.quantity,
                        transactionDate: firebase.firestore.Timestamp.now(),
                    }

                    currentAsset.transactions.push(currentAssetTransaction)
                }

                const conversionAssetPrice: number = rootGetters.assets.find((asset: Asset) => asset.symbol == conversionAsset.symbol).current_price

                const transactionQuantity = +convertCurrency(conversionAsset.quantity, currentAssetPrice, conversionAssetPrice).toFixed(8)

                // use quantity converted to new currency
                conversionAsset.quantity = transactionQuantity
                conversionAsset.transactions[0].quantity = transactionQuantity

                const assetToConvert = portfolio.find((asset) => asset.symbol === conversionAsset.symbol)

                if (assetToConvert) {
                    assetToConvert.quantity = Big(assetToConvert.quantity).plus(conversionAsset.quantity).toNumber()
                    assetToConvert.transactions.push(...conversionAsset.transactions)
                } else {
                    portfolio.push(conversionAsset)
                }
            }

            await dispatch(AuthActionTypes.updateUserAccount, { ...user.account, portfolio })
            commit(AuthMutationTypes.setLoading, false)
        }
    },
}

export default { state, mutations, getters, actions }
