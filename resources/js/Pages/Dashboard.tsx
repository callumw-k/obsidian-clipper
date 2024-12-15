import { LinkCapture } from '@/Components/LinkCapture';

import LinkList from '@/Components/LinkList';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export type Link = {
    id: number;
    title?: string;
    original_url: string;
    path: string;
    image: string;
};

export type Links = Link[];

export default function Dashboard({
    links,
    user,
}: {
    links: Links;
    user?: User;
}) {
    const [stateLinks, setLinks] = useState<Links>(links);

    useEffect(() => {
        setLinks(links);
    }, [links]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const channel = window.Echo.private(`App.Models.User.${user.id}`);

        channel.listen(
            'LinkImageUpdated',
            (event: { linkId: number; link: Link }) => {
                setLinks((prevLinks) => {
                    const existingIndex = prevLinks.findIndex(
                        (link) => link.id === event.linkId,
                    );

                    if (existingIndex !== -1) {
                        return prevLinks.map((link) =>
                            link.id === event.linkId ? event.link : link,
                        );
                    } else {
                        return [event.link, ...prevLinks];
                    }
                });
            },
        );

        return () => {
            channel.stopListening('LinkImageUpdated');
            window.Echo.leaveChannel(`private-App.Models.User.${user.id}`);
        };
    }, [user?.id]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <LinkCapture />
            <LinkList links={stateLinks} />
        </AuthenticatedLayout>
    );
}
