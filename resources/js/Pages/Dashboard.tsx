import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Link = {
    id: number;
    title?: string;
    original_url: string;
    path: string;
};

type Links = Link[];

export default function Dashboard({ links }: { links: Links }) {
    const { post, data, setData } = useForm({
        original_url: '',
    });

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/links');
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className={'flex flex-col items-center p-8'}>
                <div className={'w-full max-w-2xl'}>
                    <form onSubmit={onSubmit} className={'flex space-x-4'}>
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
            <div className={'prose mx-auto mt-8 w-full dark:prose-invert'}>
                {links.map((link) => (
                    <div
                        key={link.id}
                        className={'flex flex-row justify-between'}
                    >
                        <a target={'_blank'} href={link.original_url}>
                            {link.title ?? link.original_url}
                        </a>
                        <p className={'m-0'}>Pathname: {link.path}</p>
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
