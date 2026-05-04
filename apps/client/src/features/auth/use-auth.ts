import { firebaseAuth } from "@/services/firebase/firebase";
import { Data } from "effect";
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { use, useSyncExternalStore } from "react";

export type AuthState = Data.TaggedEnum<{
	SignedIn: { readonly user: FirebaseUser };
	SignedOut: object;
}>;

export const AuthState = Data.taggedEnum<AuthState>();

const toState = (user: FirebaseUser | null): AuthState =>
	user ? AuthState.SignedIn({ user }) : AuthState.SignedOut();

const authReady = firebaseAuth.authStateReady();

const subscribe = (notify: () => void) =>
	onAuthStateChanged(firebaseAuth, notify);
const getSnapshot = () => firebaseAuth.currentUser;

export function useAuth(): AuthState {
	use(authReady);

	const user = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return toState(user);
}
