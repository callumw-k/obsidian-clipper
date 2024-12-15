import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { z } from 'zod';

export function LinkCapture() {
    const { post, data, setData, reset } = useForm({
        original_url: '',
    });

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/links', {
            onSuccess: () => {
                reset();
            },
        });
    }

    const { toast } = useToast();

    async function handleToast() {
        const text = await navigator.clipboard.readText();
        const validated = await z.string().url().safeParseAsync(text);
        if (validated.success) {
            setData('original_url', text);
            return;
        }
        toast({
            title: "Bucko, that ain't a valid URL",
            variant: 'destructive',
            duration: 1000,
        });
    }

    return (
        <div className={'my-16 flex flex-col items-center px-4'}>
            <div className={'w-full max-w-2xl'}>
                <form onSubmit={onSubmit} className={'flex space-x-4'}>
                    <div className={'relative w-full'}>
                        <Input
                            placeholder={'URL to shorten'}
                            value={data.original_url}
                            onChange={(e) =>
                                setData('original_url', e.target.value)
                            }
                        />
                        <button
                            className={
                                'absolute right-0 top-0 h-full overflow-hidden px-2 py-2 text-input transition duration-150 hover:text-primary'
                            }
                            onClick={handleToast}
                            type={'button'}
                        >
                            <ClipboardIcon className={'size-4'} />
                        </button>
                    </div>
                    <Button type={'submit'}>Shorten URL</Button>
                </form>
            </div>
        </div>
    );
}
