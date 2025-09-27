// src/screens/auth/LoginScreen.js
import React, { useState, memo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, passwordIssues, authErrorMessage } from '../../utils/loginScreenValidator';
import styles from './LoginScreen.styles';

const LoginScreen = memo(() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [touched, setTouched] = useState({ email: false, password: false });
    const [focus, setFocus] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const { login, register } = useAuth();

    //basic custom validation
    const validate = (e = email, p = password) => {
        const next = { email: '', password: '' };

        // Email checks
        if (!e.trim()) next.email = 'Email is required.';
        else if (!isValidEmail(e)) next.email = 'That email looks off. Try "name@example.com".';

        // Password checks
        const pwdIssues = passwordIssues(p);
        if (pwdIssues.length) next.password = pwdIssues[0]; // show the first issue

        setErrors(next);
        // Valid if both empty messages
        return !next.email && !next.password;
    };

    const handleSubmit = async () => {
        // validate and show inline messages
        const ok = validate();
        setTouched({ email: true, password: true });
        if (!ok) return;

        setIsLoading(true);
        try {
            if (isLogin) {
                await login(email.trim(), password);
            } else {
                await register(email.trim(), password);
            }
        } catch (error) {
            Alert.alert('Authentication Error', authErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setErrors({ email: '', password: '' });
        setTouched({ email: false, password: false });
    };

    const onChangeEmail = (v) => {
        setEmail(v);
        if (touched.email) validate(v, password);
    };

    const onChangePassword = (v) => {
        setPassword(v);
        if (touched.password) validate(email, v);
    };

    const emailHasError = touched.email && !!errors.email;
    const pwdHasError = touched.password && !!errors.password;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1f1147" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {isLogin
                                ? 'Sign in to continue chatting'
                                : 'Join our community today'}
                        </Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    emailHasError && styles.inputError,
                                    focus.email && styles.inputFocus
                                ]}
                                placeholder="name@example.com"
                                placeholderTextColor="#b9b3d9"
                                value={email}
                                onChangeText={onChangeEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                onFocus={() => setFocus((f) => ({ ...f, email: true }))}
                                onBlur={() => {
                                    setFocus((f) => ({ ...f, email: false }));
                                    setTouched((t) => ({ ...t, email: true }));
                                    validate();
                                }}
                            />
                            {emailHasError && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    pwdHasError && styles.inputError,
                                    focus.password && styles.inputFocus
                                ]}
                                placeholder="Minimum 6 characters"
                                placeholderTextColor="#b9b3d9"
                                value={password}
                                onChangeText={onChangePassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                onFocus={() => setFocus((f) => ({ ...f, password: true }))}
                                onBlur={() => {
                                    setFocus((f) => ({ ...f, password: false }));
                                    setTouched((t) => ({ ...t, password: true }));
                                    validate();
                                }}
                            />
                            {pwdHasError && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Submit */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (isLoading || emailHasError || pwdHasError) && styles.disabledButton
                            ]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading
                                    ? (isLogin ? 'Signing In…' : 'Creating Account…')
                                    : (isLogin ? 'Sign In' : 'Create Account')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Toggle Mode */}
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </Text>
                        <TouchableOpacity onPress={toggleMode} disabled={isLoading} activeOpacity={0.7}>
                            <Text style={styles.toggleLink}>
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
});

LoginScreen.displayName = 'LoginScreen';
export default LoginScreen;
