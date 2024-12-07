import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Dashboard() {
    const { post, data, setData } = useForm({
        original_url: '',
    });

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.debug(data);
        post('/links');
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className={'flex justify-center p-8'}>
                <div className={'w-full max-w-xl'}>
                    <form onSubmit={onSubmit} className={'space-y-4'}>
                        <Input
                            placeholder={'URL to shorten'}
                            value={data.original_url}
                            onChange={(e) =>
                                setData('original_url', e.target.value)
                            }
                        />
                        <Button type={'submit'}>Shorten URL</Button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
