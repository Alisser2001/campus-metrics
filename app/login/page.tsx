'use client';

import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { login } from '@/utils/auth/helper';

const Signin: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (formData: FormData) => {
        const newErrors: Record<string, string> = {}

        const email = formData.get('email')?.toString().trim() || ''
        const password = formData.get('password')?.toString() || ''

        if (!email) {
            newErrors.email = "El email es requerido"
        } else if (!email.includes('@')) {
            newErrors.email = "El email debe tener un formato válido"
        } else if (!email.endsWith('@udea.edu.co')) {
            newErrors.email = "Debe usar un email institucional @udea.edu.co"
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida"
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        const formData = new FormData(e.currentTarget);
        if (!validateForm(formData)) {
            toast.error('Por favor, corrige los errores en el formulario');
            return;
        }
        setIsSubmitting(true);
        try {
            const result = await login(formData);
            if (result?.error) {
                toast.error(result.error);
            }
        } catch (error: any) {
            console.error('Error en login:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-screen min-h-screen h-auto flex flex-row">
            <div className="flex flex-col justify-center items-center lg:w-1/2 w-full h-screen bg-[#33691e]">
                <Card className='flex flex-col justify-center items-center w-[90%] md:w-2/3 lg:w-1/2 p-8 bg-white shadow-lg'>
                    <CardHeader className='w-full flex flex-col justify-center items-center p-0 mb-4'>
                        <Link href="/" className="flex items-center" prefetch={false}>
                            <Image src="/udea.png" alt="FaceMark" width={86} height={86} />
                        </Link>
                        <CardTitle className="text-4xl font-bold w-full text-center my-2">Bienvenido</CardTitle>
                        <CardDescription className="text-muted-foreground w-full text-center text-sm">
                            Introduce tu email y contraseña para iniciar sesión en tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='w-full flex flex-col justify-center items-center p-0'>
                        <form noValidate className="flex flex-col justify-center items-center w-full gap-y-8" onSubmit={handleSubmit}>
                            <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="name@udea.edu.co"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <div className="relative w-full">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Contraseña"
                                        autoComplete="current-password"
                                        required
                                        className={`h-12 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        {showPassword
                                            ? <EyeOff className="h-5 w-5" />
                                            : <Eye className="h-5 w-5" />
                                        }
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full h-12 bg-[#33691e] text-lg text-white cursor-pointer" disabled={isSubmitting}>
                                {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className='flex justify-center items-center w-full mt-2 p-0'>
                        <p className="text-center text-sm">
                            ¿No tienes una cuenta?{' '}
                            <Link href="/signup" className="underline">
                                Regístrate
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>

            <div className="hidden lg:block w-1/2 h-screen">
                <Image
                    src="/login-bg.jpg"
                    alt="Imagen de login"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                    priority
                />
            </div>
        </div>
    );
};

export default Signin;