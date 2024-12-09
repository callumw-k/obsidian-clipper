import { Input } from '@/Components/ui/input';
import { Link, Links } from '@/Pages/Dashboard';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

function LinkItem({ link }: { link: Link }) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, put, setData, processing } = useForm({
        title: link.title ?? '',
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (link.title === data.title) {
            setIsEditing(!isEditing);
            return;
        }
        put(`/links/${link.id}`, {
            onSuccess: () => {
                setIsEditing(!isEditing);
            },
        });
    };

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    useEffect(() => {
        // Subscribe to the private channel
        const channel = window.Echo.private(`links.${link.id}`);

        // Listen for the OrderShipmentStatusUpdated event
        channel.listen('LinkImageUpdated', (event: { link: Link }) => {
            console.log('Link updated:', event.link);
        });

        // Cleanup subscription on component unmount
        return () => {
            channel.stopListening('LinkImageUpdated');
            window.Echo.leaveChannel(`links.${link.id}`);
        };
    }, [link.id]);

    return (
        <div
            className={
                'grid grid-rows-[10rem_1fr] gap-4 sm:grid-rows-[12rem_1fr] md:grid-cols-[minmax(0,8rem),1fr] md:grid-rows-1'
            }
            key={link.id}
        >
            <div className={'overflow-hidden rounded-sm'}>
                {link.image && (
                    <img
                        className={
                            'h-full max-h-full min-h-0 w-full object-cover'
                        }
                        src={link.image}
                        alt={link.title}
                    />
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className={
                    'prose grid min-h-9 max-w-none grid-cols-[2fr,auto] items-center gap-4 dark:prose-invert'
                }
            >
                {isEditing ? (
                    <Input
                        ref={inputRef}
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={'bg-transparent px-2'}
                        placeholder={link.title}
                    />
                ) : (
                    <a
                        rel="noreferrer"
                        target={'_blank'}
                        className={'px-2'}
                        href={link.original_url}
                    >
                        {link.title ?? link.original_url}
                    </a>
                )}

                <div className={'flex items-center justify-center'}>
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
                            onClick={() => setIsEditing(true)}
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
                'mx-auto mt-8 grid w-full max-w-7xl gap-4 p-4 md:auto-rows-[minmax(0,4rem)]'
            }
        >
            {links.map((link) => (
                <LinkItem link={link} key={link.path} />
            ))}
        </div>
    );
}
