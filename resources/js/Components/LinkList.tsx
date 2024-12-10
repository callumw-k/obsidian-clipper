import { Input } from '@/Components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link, Links } from '@/Pages/Dashboard';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

function LinkItem({ link }: { link: Link }) {
    const [isEditing, setIsEditing] = useState(false);
    const [initialWidth, setInitialWidth] = useState<number | undefined>();
    const [imageStatus, setImageStatus] = useState({
        loaded: false,
        success: true,
    });

    const { data, put, setData, processing } = useForm({
        title: link.title ?? '',
    });

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (link.title === data.title) {
            setIsEditing(!isEditing);
            return;
        }
        put(`/links/${link.id}`, {
            preserveScroll: true,
        });
    };

    const { toast } = useToast();

    useEffect(() => {
        if (link.title !== data.title && link.title) {
            setData('title', link.title);
            setIsEditing(false);
        }
    }, [link.title]);

    const dynamicRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();

            dynamicRef.current = document.createElement('span');
            dynamicRef.current.innerHTML = data.title;
            document.body.appendChild(dynamicRef.current);
            setInitialWidth(dynamicRef.current.getBoundingClientRect().width);
        }
        return () => {
            if (dynamicRef.current)
                document.body.removeChild(dynamicRef.current);

            dynamicRef.current = null;
        };
    }, [isEditing]);

    const inputWidth = useMemo(() => {
        if (dynamicRef.current) {
            dynamicRef.current.innerText = data.title;
            return dynamicRef.current.getBoundingClientRect().width;
        }
    }, [dynamicRef.current, data.title]);

    const showImage = link.image && imageStatus.success;
    return (
        <div
            className={
                'grid grid-cols-1 grid-rows-[10rem_1fr] justify-between rounded-md border border-border sm:grid-rows-[12rem_1fr] md:grid-cols-[minmax(0,8rem),1fr] md:grid-rows-1'
            }
            key={link.id}
        >
            <div className={'overflow-hidden rounded-sm'}>
                <div
                    style={{
                        opacity: imageStatus.loaded || !link.image ? 1 : 0,
                        height: imageStatus.success && link.image ? 0 : '100%',
                    }}
                    className={
                        'h-full bg-gradient-to-r from-indigo-500 transition duration-500'
                    }
                />
                {showImage && (
                    <img
                        style={{
                            opacity: imageStatus.loaded ? 1 : 0,
                            zIndex: imageStatus.success ? 10 : 'initial',
                        }}
                        alt={link.title}
                        src={link.image}
                        onLoad={() =>
                            setImageStatus({ ...imageStatus, loaded: true })
                        }
                        onError={() =>
                            setImageStatus({ loaded: true, success: false })
                        }
                        className={
                            'relative h-full max-h-full min-h-0 w-full object-cover transition duration-500'
                        }
                    />
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className={
                    'prose grid min-h-[4.5rem] max-w-none grid-cols-[minmax(0,1fr)_auto] items-center py-2 pl-2 dark:prose-invert md:min-h-0'
                }
            >
                {isEditing ? (
                    <div>
                        <Input
                            ref={inputRef}
                            style={{
                                width: `calc(${(inputWidth ?? initialWidth ?? 48) / 16}rem + 1rem)`,
                            }}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={'min-w-0 bg-transparent px-2'}
                            placeholder={link.title}
                        />
                    </div>
                ) : (
                    <div
                        className={
                            'flex flex-col overflow-hidden px-2 md:flex-row md:items-center md:justify-between'
                        }
                    >
                        <div className={'max-w-5xl overflow-hidden'}>
                            <a
                                rel="noreferrer"
                                className={'md:text-nowrap'}
                                target={'_blank'}
                                href={link.original_url}
                            >
                                {link.title ?? link.original_url}
                            </a>
                        </div>
                        <button
                            // key={`copy_button_${link.path}`}
                            onClick={async () => {
                                await navigator.clipboard.writeText(
                                    `https://cwk.sh/${link.path}`,
                                );
                                toast({ title: 'Copied to clipboard' });
                            }}
                            type={'button'}
                            className={
                                'm-0 flex flex-shrink-0 flex-row items-center gap-2 text-xs md:ml-4'
                            }
                        >
                            https://cwk.sh/{link.path}
                            <ClipboardIcon className={'size-3'} />
                        </button>
                    </div>
                )}

                <div
                    className={
                        'flex items-center justify-center px-2 pr-4 md:px-4'
                    }
                >
                    {isEditing ? (
                        <button
                            key={'submit_button'}
                            type={'submit'}
                            className={'size-4'}
                        >
                            <CheckIcon className={'size-4'} />
                        </button>
                    ) : (
                        <button
                            key={'edit_button'}
                            type={'button'}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <PencilSquareIcon className={'size-4'} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default function LinkList({ links }: { links: Links }) {
    return (
        <div
            className={
                'mx-auto mt-8 grid w-full max-w-7xl gap-8 p-4 md:auto-rows-[minmax(0,4rem)]'
            }
        >
            {links.map((link) => (
                <LinkItem link={link} key={link.path} />
            ))}
        </div>
    );
}
