import router from '@/router'
import { convertCurrency } from '@/services/ConvertCurrency'
import { openToast } from '@/services/OpenToast'
import Big from 'big.js'
import { useRouter } from 'vue-router'
import firebase from '../../../firebase'
import Asset from '../assets/models/Asset'
import User from './models/User'
import UserAccount, { PortfolioItem } from './models/UserAccount'
import UserSettings from './models/UserSettings'

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

const mutations = {
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

const getters = {
    user: (state: AuthState) => state.user,
    loading: (state: AuthState) => state.loading,
    authError: (state: AuthState) => state.authError,
    isVerfied: () => firebase.auth().currentUser?.emailVerified,
    userBalance: (state: AuthState) => state.user?.account.balance,
    userPortfolio: (state: AuthState) => state.user?.account.portfolio,
    preferredCurrency: (state: AuthState) => state.user?.account.preferredCurrency,
    watchedAssets: (state: AuthState) => state.user?.account.watchedAssets,
}

const openErrorToast = (message: string) => {
    openToast(message, 'bottom', 4000)
}

const actions = {
    async signUserIn({ commit }: { commit: Function }, payload: { email: string; password: string }) {
        commit('setLoading', true)
        commit('clearError')

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
                                commit('setAuthError', "User doesn't exist.")
                            } else {
                                const newUser = snapshot.data() as User
                                commit('setUser', newUser)
                                commit('setLoading', false)
                            }
                        },
                        (e: Error) => {
                            const error = "User doesn't exist."
                            commit('setLoading', false)
                            commit('setAuthError', error)
                            openErrorToast(error)
                            console.error(e)
                        }
                    )
                } else {
                    const error =
                        'Error while connecting to the servers. Wait for some time or contact the administrator.'
                    commit('setLoading', false)
                    commit('setAuthError', error)
                    openErrorToast(error)
                    console.error(error)
                }
            })
            .catch((e: firebase.auth.Error) => {
                let error = ''
                commit('setLoading', false)
                if (e.code == 'auth/network-request-failed') {
                    error = 'Network error occured. Try connecting to the internet.'
                    commit('setAuthError', error)
                } else {
                    error = e.message
                    commit('setAuthError', error)
                }

                openErrorToast(error)
            })
    },
    async signUserUp({ commit }: { commit: Function }, payload: { name: string; email: string; password: string }) {
        commit('setLoading', true)
        commit('clearError')
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
                    commit('setUser', newUser)
                    commit('setLoading', false)
                    const usersRef = firebase.firestore().collection('users')
                    usersRef
                        .doc(uid)
                        .set(newUser)
                        .catch((e: firebase.auth.Error) => {
                            commit('setLoading', false)
                            commit('setAuthError', e.message)
                            openErrorToast(e.message)
                            console.error(e)
                        })
                }
            })
            .catch((e: firebase.auth.Error) => {
                commit('setAuthError', e.message)
                if (e.code === 'auth/email-already-in-use') {
                    openErrorToast('This email is already in use.')
                    console.error(e)
                } else {
                    openErrorToast('Error occured. Try again later or contact the administrator.')
                    console.error(e)
                }
                commit('setLoading', false)
            })
    },
    async signUserOut({ commit }: { commit: Function }) {
        commit('setLoading', true)
        // detach a real-time listener to prevent missing or insufficient permissions
        await firebase
            .auth()
            .signOut()
            .then(() => {
                commit('setUser', null)
                commit('setLoading', false)
                router.push('/')
            })
    },
    async autoSignUserIn({ commit }: { commit: Function }, payload: firebase.User) {
        commit('setLoading', true)
        const cachedUserId = payload.uid
        firebase
            .firestore()
            .collection('users')
            .doc(cachedUserId)
            .onSnapshot(
                (snapshot) => {
                    const retrievedUser = snapshot.data() as User
                    commit('setUser', retrievedUser)
                    commit('setLoading', false)
                },
                (e: firebase.auth.Error) => {
                    commit('setLoading', false)
                    commit('setAuthError', e.message)
                    openErrorToast(e.message)
                    console.error(e)
                }
            )
    },
    async updateUserAccount({ commit, state }: { commit: Function; state: AuthState }, payload: UserAccount) {
        if (state.user) {
            commit('setLoading', true)
            commit('clearError')
            await firebase
                .firestore()
                .collection('users')
                .doc(state.user.id)
                .update({ account: payload })
                .catch((e: firebase.auth.Error) => {
                    commit('setLoading', false)
                    commit('setAuthError', e.message)
                    console.error(e)
                })
            commit('setLoading', false)
        }
    },
    async changeEmail(
        { commit, dispatch, state }: { commit: Function; dispatch: any; state: AuthState },
        payload: { newEmail: string }
    ) {
        commit('setLoading', true)
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
                            commit('setLoading', false)
                            commit('setAuthError', e.message)
                            console.error(e)
                        })
                    commit('setLoading', false)
                    if (state.user) {
                        dispatch('signUserOut')
                    } else {
                        const router = useRouter()
                        router.push('/')
                    }
                })
                .catch((e: firebase.auth.Error) => {
                    commit('setLoading', false)
                    commit('setAuthError', e.message)
                    console.error(e)
                    if (e.code === 'auth/email-already-in-use') {
                        openErrorToast('Provided email is occupied. Please choose another one.')
                    } else if (e.code === 'auth/requires-recent-login') {
                        // handle reauthentication if needed
                        // dispatch("setReauthenticationDialog", true);
                    }
                })
    },
    async changePassword({ commit, dispatch }: { commit: Function; dispatch: any }, payload: { email: string }) {
        commit('setLoading', true)
        firebase
            .auth()
            .sendPasswordResetEmail(payload.email)
            .then(() => {
                commit('setLoading', false)
                if (state.user) {
                    dispatch('signUserOut')
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
                commit('setLoading', false)
                commit('setAuthError', e.message)
                if (e.code === 'auth/requires-recent-login') {
                    console.error('Reauthentication needed to perform this action.')
                    // dispatch("setReauthenticationDialog", true);
                } else {
                    openErrorToast(e.message)
                }
            })
    },
    async deleteAccount({ commit, dispatch, state }: { commit: Function; dispatch: any; state: AuthState }) {
        commit('setLoading', false)
        const user = firebase.auth().currentUser
        if (user) {
            const uid = user.uid
            user.delete()
                .then(() => {
                    commit('setLoading', false)
                    if (state.user) {
                        dispatch('signUserOut')
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
                    commit('setLoading', false)
                    commit('setAuthError', e.message)
                    if (e.code === 'auth/requires-recent-login') {
                        console.error('Reauthentication needed to perform this action.')
                        // dispatch("setReauthenticationDialog", true);
                    } else {
                        openErrorToast(e.message)
                    }
                })
        }
    },
    async buyAsset(
        { dispatch, commit, state }: { dispatch: any; commit: Function; state: AuthState },
        payload: PortfolioItem
    ) {
        const { user } = state
        if (user) {
            commit('setLoading', true)
            commit('clearError')
            const portfolio = user.account.portfolio
            const assetExists = portfolio.find((asset) => asset.symbol === payload.symbol)

            if (assetExists) {
                // assetExists.quantity += payload.quantity
                assetExists.quantity = Big(assetExists.quantity).plus(payload.quantity).toNumber()
                assetExists.transactions.push(...payload.transactions)
            } else {
                portfolio.push(payload)
            }

            await dispatch('updateUserAccount', user.account)
            commit('setLoading', false)
        }
    },
    async sellAsset(
        { dispatch, commit, state }: { dispatch: any; commit: Function; state: AuthState },
        payload: { symbol: string }
    ) {
        const { user } = state
        const { symbol } = payload
        if (user) {
            commit('setLoading', true)
            commit('clearError')
            let portfolio = user.account.portfolio
            portfolio = portfolio.filter((asset) => asset.symbol !== symbol)

            await dispatch('updateUserAccount', { ...user.account, portfolio })
            commit('setLoading', false)
        }
    },
    async convertAsset(
        {
            dispatch,
            commit,
            state,
            rootGetters,
        }: { dispatch: any; commit: Function; state: AuthState; rootGetters: any },
        payload: { currentAssetSymbol: string; conversionAsset: PortfolioItem }
    ) {
        const { user } = state
        const { currentAssetSymbol, conversionAsset } = payload
        if (user) {
            commit('setLoading', true)
            commit('clearError')

            let portfolio = user.account.portfolio
            const currentAsset = portfolio.find((asset) => asset.symbol === currentAssetSymbol)
            const currentAssetPrice: number = rootGetters.assets.find(
                (asset: Asset) => asset.symbol == currentAssetSymbol
            ).current_price

            if (currentAsset) {
                // conversionAsset.quantity is provided in a currency before conversion (currentAsset)
                currentAsset.quantity = Big(currentAsset?.quantity).minus(conversionAsset.quantity).toNumber()
                if (currentAsset.quantity == 0) {
                    console.log('remove current asset')
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

                const conversionAssetPrice: number = rootGetters.assets.find(
                    (asset: Asset) => asset.symbol == conversionAsset.symbol
                ).current_price

                const transactionQuantity = +convertCurrency(
                    conversionAsset.quantity,
                    currentAssetPrice,
                    conversionAssetPrice
                ).toFixed(8)

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

            await dispatch('updateUserAccount', { ...user.account, portfolio })
            commit('setLoading', false)
        }
    },
}

export default { state, mutations, getters, actions }
