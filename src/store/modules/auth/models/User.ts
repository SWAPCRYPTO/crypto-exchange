import UserAccount from './UserAccount'
import UserSettings from './UserSettings'

export default interface User {
    id: string
    email: string
    name: string
    account: UserAccount
    settings: UserSettings
}
